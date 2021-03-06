import mongoose from 'mongoose';

import { Repo } from '@bookio/core/infra/Repo';
import { UniqueEntityID } from '@bookio/core/domain';
import { City } from '../domain/city';
import { ICityModel } from '@bookio/infra/mongoose/types/city-type';
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

  public async exists(id: UniqueEntityID | string) {
    return this.cityModel.exists({ _id: id });
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
      const res = await this.cityModel.remove({ _id: id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }

  public async search(partialName: string) {
    // This could be changed to Mongodb Atlas search
    const dbCities = await this.cityModel.aggregate([
      {
        $match: {
          name: {
            $regex: partialName,
            $options: 'i',
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);

    return dbCities.map(CityAdapter.toDomain);
  }
}
