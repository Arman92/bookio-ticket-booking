import { Document, Types } from 'mongoose';
import { ISharedModel } from './shared-model';

export interface IStation extends Document {
  city: Types.ObjectId;
  name: string;
  latitude: number;
  longitude: number;
}

export interface IStationModel extends IStation, ISharedModel {}
