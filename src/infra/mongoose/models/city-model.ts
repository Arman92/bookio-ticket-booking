import mongoose, { Schema } from 'mongoose';

import { ICityModel } from '../types/city-type';

const CitySchema = new Schema<ICityModel>(
  {
    name: {
      type: String,
      required: true,
      index: { type: 'text' },
    },
  },
  {
    timestamps: true,
  }
);

CitySchema.pre('findOneAndUpdate', function () {
  this.setUpdate({ ...this.getUpdate(), updatedAt: new Date() });
});

CitySchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

export const CityModel = mongoose.model<ICityModel>('City', CitySchema);
