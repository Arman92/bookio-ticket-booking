import mongoose, { Schema } from 'mongoose';

import { IBookingModel } from '../types/booking-type';
import FKHelper from '../foreign-key-helper';
import { TripModel } from './trip-model';
import { StationModel } from './station-model';
import { UserModel } from '.';

const BookingSchema = new Schema<IBookingModel>(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(TripModel, v);
          },
          msg: 'Trip does not exist!',
        },
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(UserModel, v);
          },
          msg: 'User does not exist!',
        },
      ],
    },
    seats: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    destinationStation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(StationModel, v);
          },
          msg: 'destination station does not exist!',
        },
      ],
    },
    isCanceled: {
      type: Boolean,
      require: false,
      default: false,
    },
    cancelReason: {
      type: String,
      require: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.pre('findOneAndUpdate', function () {
  this.setUpdate({ ...this.getUpdate(), updatedAt: new Date() });
});

BookingSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

export const BookingModel = mongoose.model<IBookingModel>(
  'Booking',
  BookingSchema
);
