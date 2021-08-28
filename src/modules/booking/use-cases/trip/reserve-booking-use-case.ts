import { differenceInMinutes } from 'date-fns';

import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { ForbiddenError, NotFoundError } from '@shypple/core/logic/api-errors';
import { Booking } from '../../domain/booking';
import { TripRepo, BookingRepo, UserRepo } from '../../repos';
import { UniqueEntityID } from '@shypple/core/domain';
export interface ReserveBookingDTO {
  tripId: string;
  userId: string;
  seats: number;
}

export class ReserveBookingUseCase
  implements UseCase<ReserveBookingDTO, Promise<unknown>>
{
  public static readonly RESERVE_SECONDS = 10 * 60; // 10 minutes
  private tripRepo: TripRepo;
  private bookingRepo: BookingRepo;
  private userRepo: UserRepo;

  constructor(
    tripRepo: TripRepo,
    bookingRepo: BookingRepo,
    userRepo: UserRepo
  ) {
    this.tripRepo = tripRepo;
    this.bookingRepo = bookingRepo;
    this.userRepo = userRepo;
  }

  async execute(req: ReserveBookingDTO): Promise<Result<Booking>> {
    const { tripId, userId, seats } = req;

    const trip = await this.tripRepo.findById(tripId);
    if (!trip) {
      return Result.fail(new NotFoundError('Trip entity does not exist.'));
    }

    const reservedCount = await this.bookingRepo.getReservedBookingsCount(
      new UniqueEntityID(tripId)
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

    await this.bookingRepo.reserveBooking(
      tripId,
      userId,
      seats,
      ReserveBookingUseCase.RESERVE_SECONDS
    );

    return Result.ok();
  }
}
