import mongoose from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import {
  TransportVehicle,
  TransportVehicleType,
} from '../domain/transport-vehicle';
import { UniqueEntityID } from '@shypple/core/domain';
import { ITransportVehicleModel } from '@shypple/infra/mongoose/types/transport-vehicle-type';
import { TransportVehicleAdapter } from '../adapters/transport-vehicle-adapter';

export interface ITransportVehicleRepo extends Repo<TransportVehicle> {
  findById(id: UniqueEntityID): Promise<TransportVehicle>;
  removeById(id: UniqueEntityID): Promise<boolean>;
  findByType(type: TransportVehicleType): Promise<TransportVehicle[]>;
}

export class TransportVehicleRepo implements ITransportVehicleRepo {
  private transportVehicleModel: mongoose.Model<ITransportVehicleModel>;

  constructor(transportVehicleModel: mongoose.Model<ITransportVehicleModel>) {
    this.transportVehicleModel = transportVehicleModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.transportVehicleModel.exists({ _id: id });
  }

  public async save(transportVehicle: TransportVehicle) {
    const updated = await this.transportVehicleModel.findOneAndUpdate(
      { _id: transportVehicle.id },
      {
        name: transportVehicle.name,
        type: transportVehicle.type,
        capacity: transportVehicle.capacity,
        amenities: transportVehicle.amenities,
      },
      { upsert: true, useFindAndModify: false }
    );

    return TransportVehicleAdapter.toDomain(updated);
  }

  public async findById(id: UniqueEntityID) {
    const dbTransportVehicle = await this.transportVehicleModel.findById(id);

    return TransportVehicleAdapter.toDomain(dbTransportVehicle);
  }

  public async findByType(type: TransportVehicleType) {
    const dbTransportVehicles = await this.transportVehicleModel.find({
      type: type,
    });

    return dbTransportVehicles.map(TransportVehicleAdapter.toDomain);
  }

  public async removeById(id: UniqueEntityID) {
    try {
      const res = await this.transportVehicleModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
