import mongoose from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { Station } from '../domain/station';
import { UniqueEntityID } from '@shypple/core/domain';
import { IStationModel } from '@shypple/infra/mongoose/types/station-type';
import { StationAdapter } from '../adapters/station-adapter';

export interface IStationRepo extends Repo<Station> {
  findById(id: string): Promise<Station>;
  removeById(id: string): Promise<boolean>;
  findByCityId(cityId: string): Promise<Station[]>;
}

export class StationRepo implements IStationRepo {
  private stationModel: mongoose.Model<IStationModel>;

  constructor(stationModel: mongoose.Model<IStationModel>) {
    this.stationModel = stationModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.stationModel.exists({ _id: id });
  }

  public async save(station: Station) {
    const updated = await this.stationModel.findOneAndUpdate(
      { _id: station.id },
      {
        city: station.cityId.toString(),
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
      },
      { upsert: true, useFindAndModify: false }
    );

    return StationAdapter.toDomain(updated);
  }

  public async findById(id: string) {
    const dbStation = await this.stationModel.findById(id);

    return StationAdapter.toDomain(dbStation);
  }

  public async findByCityId(cityId: string) {
    const dbStations = await this.stationModel.find({
      city: cityId,
    });

    return dbStations.map(StationAdapter.toDomain);
  }

  public async removeById(id: string) {
    try {
      const res = await this.stationModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
