import { UniqueEntityID } from '@bookio/core/domain';
import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { NotFoundError } from '@bookio/core/logic/api-errors';
import {
  TripRepo,
  TransportVehicleRepo,
  StationRepo,
} from '@bookio/modules/booking/repos';
import { Trip } from '../../domain/trip';

export interface CreateTripDTO {
  fromStationId: UniqueEntityID;
  toStationId: UniqueEntityID;
  transportVehicleId: UniqueEntityID;
  departureDate: string;
  arrivalDate: string;
  fare: number;
  stops?: UniqueEntityID[];
}

export class CreateTripUseCase implements UseCase<CreateTripDTO, Result<Trip>> {
  private tripRepo: TripRepo;
  private stationRepo: StationRepo;
  private transportVehicleRepo: TransportVehicleRepo;

  constructor(
    tripRepo: TripRepo,
    stationRepo: StationRepo,
    transportVehicleRepo: TransportVehicleRepo
  ) {
    this.tripRepo = tripRepo;
    this.stationRepo = stationRepo;
    this.transportVehicleRepo = transportVehicleRepo;
  }

  public async execute(req: CreateTripDTO): Promise<Result<Trip>> {
    const fromStationExists = await this.stationRepo.exists(req.fromStationId);
    const toStationExists = await this.stationRepo.exists(req.toStationId);

    if (!fromStationExists) {
      return Result.fail(new NotFoundError('From Station does not exist.'));
    }

    if (!toStationExists) {
      return Result.fail(new NotFoundError('To Station does not exist.'));
    }

    const transportVehicle = await this.transportVehicleRepo.findById(
      req.transportVehicleId
    );

    if (!transportVehicle) {
      return Result.fail(
        new NotFoundError('Transport vehicle does not exist.')
      );
    }

    const tripOrError = Trip.create({
      fromStationId: req.fromStationId,
      toStationId: req.toStationId,
      transportVehicleId: req.transportVehicleId,
      departureDate: new Date(req.departureDate),
      arrivalDate: new Date(req.arrivalDate),
      fare: req.fare,
      capacity: transportVehicle.capacity,
      stops: req.stops,
    });

    if (tripOrError.isFailure) {
      return Result.fail(tripOrError.errorValue());
    }

    const dbTrip = await this.tripRepo.save(tripOrError.getValue());

    return Result.ok(dbTrip);
  }
}
