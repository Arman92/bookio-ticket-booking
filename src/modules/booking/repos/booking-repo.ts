import mongoose from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { Booking } from '../domain/booking';
import { UniqueEntityID } from '@shypple/core/domain';
import { IBookingModel } from '@shypple/infra/mongoose/types/booking-type';
import { BookingAdapter } from '../adapters/booking-adapter';

export interface IBookingRepo extends Repo<Booking> {
  findById(id: string): Promise<Booking>;
  removeById(id: string): Promise<boolean>;
}

export class BookingRepo implements IBookingRepo {
  private bookingModel: mongoose.Model<IBookingModel>;

  constructor(bookingModel: mongoose.Model<IBookingModel>) {
    this.bookingModel = bookingModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.bookingModel.exists({ _id: id });
  }

  public async save(booking: Booking) {
    const updated = await this.bookingModel.findOneAndUpdate(
      { _id: booking.id },
      {
        trip: booking.tripId.toString(),
        seats: booking.seats,
        fare: booking.fare,
        totalFare: booking.totalFare,
        destinationStation: booking.destinationStation
          ? booking.destinationStation.toString()
          : undefined,
      },
      { upsert: true, useFindAndModify: false }
    );

    return BookingAdapter.toDomain(updated);
  }

  public async findById(id: string) {
    const dbBooking = await this.bookingModel.findById(id);

    return BookingAdapter.toDomain(dbBooking);
  }

  public async removeById(id: string) {
    try {
      const res = await this.bookingModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
