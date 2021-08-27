import { Document, Types } from 'mongoose';
import { ISharedModel } from './shared-model';

export interface IBooking extends Document {
  trip: Types.ObjectId;
  user: Types.ObjectId;
  seats: number;
  fare: number;
  totalFare: number;
  destinationStation: Types.ObjectId;
  isCanceled?: boolean;
  cancelReason?: string;
}

export interface IBookingModel extends IBooking, ISharedModel {}
