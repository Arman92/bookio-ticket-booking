import { differenceInMinutes } from 'date-fns';

import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { ForbiddenError, NotFoundError } from '@shypple/core/logic/api-errors';
import { Booking } from '../../domain/booking';
import { StationRepo, TripRepo, BookingRepo, UserRepo } from '../../repos';
export interface BookDTO {
  tripId: string;
  userId: string;
  seats: number;
  destinationStationId?: string;
}

export class BookUseCase implements UseCase<BookDTO, Promise<unknown>> {
  private tripRepo: TripRepo;
  private stationRepo: StationRepo;
  private bookingRepo: BookingRepo;
  private userRepo: UserRepo;

  constructor(
    tripRepo: TripRepo,
    stationRepo: StationRepo,
    bookingRepo: BookingRepo,
    userRepo: UserRepo
  ) {
    this.tripRepo = tripRepo;
    this.stationRepo = stationRepo;
    this.bookingRepo = bookingRepo;
    this.userRepo = userRepo;
  }

  async execute(req: BookDTO): Promise<Result<Booking>> {
    const { tripId, userId, seats, destinationStationId } = req;

    const trip = await this.tripRepo.findById(tripId);
    if (!trip) {
      return Result.fail(new NotFoundError('Trip entity does not exist.'));
    }

    // Check for reserved bookings, excluding the reservation that same user may have submitted
    const reservedCount = await this.bookingRepo.getReservedBookingsCount(
      new UniqueEntityID(tripId),
      new UniqueEntityID(userId)
    );
    if (trip.capacity - reservedCount < seats) {
      return Result.fail(
        new ForbiddenError('There is not enough seats in this trip.')
      );
    }

    if (differenceInMinutes(trip.departureDate, new Date()) < 30) {
      return Result.fail(
        new ForbiddenError('Less than 30 minutes remaining to departure.')
      );
    }

    const userExists = await this.userRepo.exists(userId);
    if (!userExists) {
      return Result.fail(new NotFoundError('User does not exist.'));
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
      return Result.fail(bookingOrError.error);
    }

    const dbBooking = await this.bookingRepo.save(bookingOrError.getValue());
    await this.tripRepo.reduceCapacity(trip.id.toString(), seats);

    // Remove the reservation:
    this.bookingRepo.removeReservation(
      new UniqueEntityID(tripId),
      new UniqueEntityID(userId)
    );

    return Result.ok(dbBooking);
  }
}
