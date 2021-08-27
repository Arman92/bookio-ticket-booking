import mongoose, { Schema } from 'mongoose';

import { ITripModel } from '../types/trip-type';
import FKHelper from '../foreign-key-helper';
import { StationModel } from './station-model';

const TripSchema = new Schema<ITripModel>(
  {
    fromStation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(StationModel, v);
          },
          msg: 'from Station does not exist!',
        },
      ],
    },
    toStation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(StationModel, v);
          },
          msg: 'to Station does not exist!',
        },
      ],
    },
    bus: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
      autopopulate: true,
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(StationModel, v);
          },
          msg: 'Bus does not exist!',
        },
      ],
    },
    departureDate: {
      type: Date,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    stops: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

TripSchema.pre('findOneAndUpdate', function () {
  this.setUpdate({ ...this.getUpdate(), updatedAt: new Date() });
});

TripSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

export const TripModel = mongoose.model<ITripModel>('Trip', TripSchema);
