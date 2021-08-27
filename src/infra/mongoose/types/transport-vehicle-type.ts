import { Document } from 'mongoose';
import { ISharedModel } from './shared-model';
import { TransportVehicleType } from '@shypple/modules/booking/domain/transport-vehicle';

export interface IdTransportVehicle extends Document {
  name: string;
  type: TransportVehicleType;
  capacity: number;
  amenities: string[];
}

export interface IdTransportVehicleModel
  extends IdTransportVehicle,
    ISharedModel {}
