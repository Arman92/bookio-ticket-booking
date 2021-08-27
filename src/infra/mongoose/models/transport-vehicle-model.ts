import mongoose, { Schema } from 'mongoose';

import { ITransportVehicleModel } from '../types/transport-vehicle-type';

const TransportVehicleSchema = new Schema<ITransportVehicleModel>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

TransportVehicleSchema.pre('findOneAndUpdate', function () {
  this.setUpdate({ ...this.getUpdate(), updatedAt: new Date() });
});

TransportVehicleSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

export const TransportVehicleModel = mongoose.model<ITransportVehicleModel>(
  'TransportVehicle',
  TransportVehicleSchema
);
