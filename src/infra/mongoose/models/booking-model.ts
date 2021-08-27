import mongoose, { Schema } from 'mongoose';

import { IBookingModel } from '../types/booking-type';
import FKHelper from '../foreign-key-helper';
import { CityModel } from './city-model';

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
            return FKHelper(CityModel, v);
          },
          msg: 'Trip does not exist!',
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
            return FKHelper(CityModel, v);
          },
          msg: 'destination station does not exist!',
        },
      ],
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
