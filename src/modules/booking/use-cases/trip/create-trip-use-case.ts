import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { NotFoundError } from '@shypple/core/logic/api-errors';
import {
  TripRepo,
  TransportVehicleRepo,
  StationRepo,
} from '@shypple/modules/booking/repos';
import { Trip } from '../../domain/trip';

export interface CreateTripDTO {
  fromStationId: string;
  toStationId: string;
  transportVehicleId: string;
  durationMins: number;
  fare: number;
  stops?: string[];
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

    const transportVehicleExists = await this.transportVehicleRepo.exists(
      req.transportVehicleId
    );

    if (!transportVehicleExists) {
      return Result.fail(
        new NotFoundError('Transport vehicle does not exist.')
      );
    }

    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(req.fromStationId),
      toStationId: new UniqueEntityID(req.toStationId),
      transportVehicleId: new UniqueEntityID(req.transportVehicleId),
      durationMins: req.durationMins,
      fare: req.fare,
      stops:
        req.stops && req.stops.length
          ? req.stops.map((stop) => new UniqueEntityID(stop))
          : [],
    });

    if (tripOrError.isFailure) {
      return Result.fail(tripOrError.errorValue());
    }

    const dbTrip = await this.tripRepo.save(tripOrError.getValue());

    return Result.ok(dbTrip);
  }
}
