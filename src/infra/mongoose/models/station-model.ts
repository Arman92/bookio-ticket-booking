/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

import FKHelper from '../foreign-key-helper';
import { IStationModel } from '../types/station-type';
import { CityModel } from './city-model';

const StationSchema = new Schema<IStationModel>(
  {
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,

      validate: [
        {
          validator(v: any) {
            return FKHelper(CityModel, v);
          },
          msg: 'City does not exist!',
        },
      ],
    },
    name: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

StationSchema.pre('findOneAndUpdate', function () {
  this.setUpdate({ ...this.getUpdate(), updatedAt: new Date() });
});

StationSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

StationSchema.plugin(autoPopulate);

export const StationModel = mongoose.model<IStationModel>(
  'Station',
  StationSchema
);
