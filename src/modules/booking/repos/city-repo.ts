import mongoose from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { UniqueEntityID } from '@shypple/core/domain';
import { City } from '../domain/city';
import { ICityModel } from '@shypple/infra/mongoose/types/city-type';
import { CityAdapter } from '../adapters/city-adapter';

export interface ICityRepo extends Repo<City> {
  findById(id: UniqueEntityID): Promise<City>;
  removeById(id: UniqueEntityID): Promise<boolean>;
}

export class CityRepo implements ICityRepo {
  private cityModel: mongoose.Model<ICityModel>;

  constructor(cityModel: mongoose.Model<ICityModel>) {
    this.cityModel = cityModel;
  }

  public async exists(id: UniqueEntityID) {
    return this.cityModel.exists({ id });
  }

  public async save(city: City) {
    const updated = await this.cityModel.findOneAndUpdate(
      { _id: city.id },
      {
        name: city.name,
      },
      { upsert: true, useFindAndModify: false }
    );

    return CityAdapter.toDomain(updated);
  }

  public async findById(id: UniqueEntityID) {
    const dbCity = await this.cityModel.findById(id);

    return CityAdapter.toDomain(dbCity);
  }

  public async removeById(id: UniqueEntityID) {
    try {
      const res = await this.cityModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
