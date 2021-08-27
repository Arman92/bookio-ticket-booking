import { Document } from 'mongoose';
import { ISharedModel } from './shared-model';
import { TransportVehicleType } from '@shypple/modules/booking/domain/transport-vehicle';

export interface ITransportVehicle extends Document {
  name: string;
  type: TransportVehicleType;
  capacity: number;
  amenities: string[];
}

export interface ITransportVehicleModel
  extends ITransportVehicle,
    ISharedModel {}
