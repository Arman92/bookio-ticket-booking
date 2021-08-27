import { Document, Types } from 'mongoose';
import { ISharedModel } from './shared-model';

export interface ITrip extends Document {
  fromStation: Types.ObjectId;
  toStation: Types.ObjectId;
  bus: Types.ObjectId;
  durationMins: number;
  fare: number;
  stops: Types.ObjectId[];
}

export interface ITripModel extends ITrip, ISharedModel {}