import { differenceInMinutes } from 'date-fns';

import { UniqueEntityID } from '@bookio/core/domain';
import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { ForbiddenError, NotFoundError } from '@bookio/core/logic/api-errors';
import { Booking } from '../../domain/booking';
import { StationRepo, TripRepo, BookingRepo, UserRepo } from '../../repos';
export interface BookDTO {
  tripId: UniqueEntityID;
  userId: UniqueEntityID;
  seats: number;
  destinationStationId?: UniqueEntityID;
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
      tripId,
      userId
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
      tripId: tripId,
      userId: userId,
      seats,
      fare: trip.fare,
      totalFare: seats * trip.fare, // TODO: Maybe add some discounts if applicable
      destinationStation: destinationStationId || trip.toStationId,
    });

    if (bookingOrError.isFailure) {
      return Result.fail(bookingOrError.error);
    }

    const dbBooking = await this.bookingRepo.save(bookingOrError.getValue());
    await this.tripRepo.reduceCapacity(trip.id, seats);

    // Remove the reservation:
    this.bookingRepo.removeReservation(tripId, userId);

    return Result.ok(dbBooking);
  }
}
