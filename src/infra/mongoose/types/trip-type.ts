import { Document, Types } from 'mongoose';
import { ISharedModel } from './shared-model';

export interface ITrip extends Document {
  fromStation: Types.ObjectId;
  fromCity: Types.ObjectId;
  toStation: Types.ObjectId;
  toCity: Types.ObjectId;
  transportVehicle: Types.ObjectId;
  departureDate: Date;
  arrivalDate: Date;
  fare: number;
  stops: Types.ObjectId[];
  capacity: number;
}

export interface ITripModel extends ITrip, ISharedModel {}
