import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { NotFoundError } from '@shypple/core/logic/api-errors';
import { Booking } from '../../domain/booking';
import { StationRepo, TripRepo } from '../../repos';
export interface BookDTO {
  tripId: string;
  userId: string;
  seats: number;
  destinationStationId?: string;
}

export class BookUseCase implements UseCase<BookDTO, Promise<unknown>> {
  private tripRepo: TripRepo;
  private stationRepo: StationRepo;

  constructor(tripRepo: TripRepo, stationRepo: StationRepo) {
    this.tripRepo = tripRepo;
    this.stationRepo = stationRepo;
  }

  async execute(req: BookDTO): Promise<unknown> {
    const { tripId, userId, seats, destinationStationId } = req;

    const trip = await this.tripRepo.findById(tripId);
    if (!trip) {
      return Result.fail(new NotFoundError('Trip entity does not exist.'));
    }

    if (destinationStationId) {
      const destinationStation = await this.stationRepo.findById(
        destinationStationId
      );
      if (!destinationStation) {
        return Result.fail(
          new NotFoundError('Destination station does not exist.')
        );
      }
    }

    const bookingOrError = Booking.create({
      tripId: new UniqueEntityID(tripId),
      userId: new UniqueEntityID(userId),
      seats,
      fare: trip.fare,
      totalFare: seats * trip.fare, // TODO: Maybe add some discounts if applicable
      destinationStation: new UniqueEntityID(destinationStationId),
    });

    if (bookingOrError.isFailure) {
      return Result.fail<void>(bookingOrError.error);
    }

    const dbBooking = await this.
  }
}
