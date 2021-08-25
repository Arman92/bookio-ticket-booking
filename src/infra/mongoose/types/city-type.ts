import { Document } from 'mongoose';
import { ISharedModel } from './shared-model';

export interface ICity extends Document {
  name: string;
}

export interface ICityModel extends ICity, ISharedModel {}
