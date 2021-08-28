import { differenceInMinutes } from 'date-fns';

import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { ForbiddenError, NotFoundError } from '@shypple/core/logic/api-errors';
import { Booking } from '../../domain/booking';
import { TripRepo, BookingRepo, UserRepo } from '../../repos';
import { UniqueEntityID } from '@shypple/core/domain';

export interface RefundBookingDTO {
  bookingId: UniqueEntityID;
  userId: UniqueEntityID;
  reason?: string;
}

export class RefundBookingUseCase
  implements UseCase<RefundBookingDTO, Promise<unknown>>
{
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

  async execute(req: RefundBookingDTO): Promise<Result<Booking>> {
    const { bookingId, userId, reason } = req;

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      return Result.fail(new NotFoundError('Booking entity does not exist.'));
    }

    const trip = await this.tripRepo.findById(booking.tripId);
    if (!trip) {
      return Result.fail(new NotFoundError('Trip entity does not exist.'));
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

    const dbBooking = await this.bookingRepo.cancelBooking(booking.id, reason);

    await this.tripRepo.increaseCapacity(trip.id, booking.seats);

    return Result.ok(dbBooking);
  }
}
