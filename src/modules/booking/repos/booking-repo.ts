import mongoose, { Types } from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { Booking } from '../domain/booking';
import { UniqueEntityID } from '@shypple/core/domain';
import { IBookingModel } from '@shypple/infra/mongoose/types/booking-type';
import { BookingAdapter } from '../adapters/booking-adapter';
import { RedisClient } from '@shypple/infra/redis';
import { ITripModel } from '@shypple/infra/mongoose/types/trip-type';

export interface IBookingRepo extends Repo<Booking> {
  findById(id: UniqueEntityID): Promise<Booking>;
  removeById(id: UniqueEntityID): Promise<boolean>;
}

export class BookingRepo implements IBookingRepo {
  private bookingModel: mongoose.Model<IBookingModel>;
  private tripModel: mongoose.Model<ITripModel>;

  constructor(
    bookingModel: mongoose.Model<IBookingModel>,
    tripModel: mongoose.Model<ITripModel>
  ) {
    this.bookingModel = bookingModel;
    this.tripModel = tripModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.bookingModel.exists({ _id: id });
  }

  public async save(booking: Booking) {
    const updated = await this.bookingModel.findOneAndUpdate(
      { _id: booking.id },
      {
        trip: booking.tripId.toString(),
        user: booking.userId.toString(),
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

  public async findById(id: UniqueEntityID) {
    const dbBooking = await this.bookingModel.findById(id);

    return BookingAdapter.toDomain(dbBooking);
  }

  public async removeById(id: UniqueEntityID) {
    try {
      const res = await this.bookingModel.remove({ _id: id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }

  public async cancelBooking(bookingId: UniqueEntityID, reason: string) {
    const updated = await this.bookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        $set: {
          isCanceled: true,
          cancelReason: reason,
        },
      },
      { upsert: false, useFindAndModify: false }
    );

    return BookingAdapter.toDomain(updated);
  }

  public async reserveBooking(
    tripId: UniqueEntityID,
    userId: UniqueEntityID,
    seats: number,
    seconds: number
  ): Promise<void> {
    const key = `trip-${tripId}-reserves`;
    const member = `${userId}-seats-${seats}`;
    const regex = /([0-9a-z]*)+(-seats-)(\d+)/g;

    const reservations = await RedisClient.Instance.getSetMembers(key);

    for (const reservation of reservations) {
      const regResult = regex.exec(reservation);
      const userId = new UniqueEntityID(regResult[1]);
      if (userId === userId) {
        throw new Error('User already has a reservation in this trip.');
      }
    }

    await RedisClient.Instance.addToSet(key, member);
    return RedisClient.Instance.expireMember(key, member, seconds);
  }

  public async getBookingsReportByTrip(tripId: UniqueEntityID) {
    return (
      await this.bookingModel.aggregate([
        { $match: { trip: Types.ObjectId(tripId.toString()) } },
        {
          $group: {
            _id: '$trip',
            totalFare: { $sum: '$totalFare' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
    )[0];
  }

  public async getBookingsReportByDepartureCity(cityId: UniqueEntityID) {
    return await this.tripModel.aggregate([
      { $match: { fromCity: Types.ObjectId(cityId.toString()) } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'trip',
          as: 'booking',
        },
      },
      {
        $unwind: '$booking',
      },
      {
        $replaceRoot: {
          newRoot: '$booking',
        },
      },
      {
        $group: {
          _id: '$trip',
          totalFare: { $sum: '$totalFare' },
          seatsSold: { $sum: '$seats' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          trip: '$_id',
          totalFare: 1,
          seatsSold: 1,
          count: 1,
        },
      },
      {
        $lookup: {
          from: 'trips',
          localField: 'trip',
          foreignField: '_id',
          as: 'trip',
        },
      },
    ]);
  }

  public async getReservedBookings(tripId: UniqueEntityID) {
    const reserved = await RedisClient.Instance.getSetMembers(
      `trip-${tripId}-reserves`
    );
    const regex = /([0-9a-z]*)+(-seats-)(\d+)/g;

    const result: {
      userId: UniqueEntityID;
      seats: number;
    }[] = [];

    for (const reservation of reserved) {
      const regResult = regex.exec(reservation);
      const userId = new UniqueEntityID(regResult[1]);
      const seats = parseInt(regResult[3], 10);

      result.push({
        userId,
        seats,
      });
    }

    return result;
  }

  public async getReservedBookingsCount(
    tripId: UniqueEntityID,
    userIdToExclude?: UniqueEntityID
  ) {
    const reservations = await this.getReservedBookings(tripId);

    return reservations.reduce((sum, reservation) => {
      if (userIdToExclude && userIdToExclude === reservation.userId) return sum;
      return sum + reservation.seats;
    }, 0);
  }

  public async removeReservation(
    tripId: UniqueEntityID,
    userId: UniqueEntityID
  ) {
    const reservations = await this.getReservedBookings(tripId);
    const reservation = reservations.find((res) => res.userId.equals(userId));

    if (reservation) {
      RedisClient.Instance.removeFromSet(
        `trip-${tripId}-reserves`,
        `${userId}-seats-${reservation.seats}`
      );
    }
  }
}
