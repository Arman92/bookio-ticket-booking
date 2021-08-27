import mongoose, { Types } from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../domain/trip';
import { ITripModel } from '@shypple/infra/mongoose/types/trip-type';
import { TripAdapter } from '../adapters/trip-adapter';
import { ICityModel } from '@shypple/infra/mongoose/types/city-type';
import { IStationModel } from '@shypple/infra/mongoose/types/station-type';

export interface ITripRepo extends Repo<Trip> {
  findById(id: UniqueEntityID): Promise<Trip>;
  removeById(id: UniqueEntityID): Promise<boolean>;
}

export class TripRepo implements ITripRepo {
  private tripModel: mongoose.Model<ITripModel>;
  private stationsModel: mongoose.Model<IStationModel>;

  constructor(
    tripModel: mongoose.Model<ITripModel>,
    stationsModel: mongoose.Model<IStationModel>
  ) {
    this.tripModel = tripModel;
    this.stationsModel = stationsModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.tripModel.exists({ _id: id });
  }

  public async save(trip: Trip) {
    const toStation = await this.stationsModel.findById(trip.toStationId);
    const fromStation = await this.stationsModel.findById(trip.fromStationId);

    const updated = await this.tripModel.findOneAndUpdate(
      { _id: trip.id },
      {
        toStation: trip.toStationId.toString(),
        toCity: toStation.city,
        fromStation: trip.fromStationId.toString(),
        fromCity: fromStation.city,
        transportVehicle: trip.transportVehicleId.toString(),
        departureDate: trip.departureDate,
        arrivalDate: trip.arrivalDate,
        fare: trip.fare,
        stops: trip.stops.map((stop) => stop.toString()),
      },
      { upsert: true, useFindAndModify: false }
    );

    return TripAdapter.toDomain(updated);
  }

  public async findById(id: UniqueEntityID) {
    const dbTrip = await this.tripModel.findById(id);

    return TripAdapter.toDomain(dbTrip);
  }

  public async removeById(id: UniqueEntityID) {
    try {
      const res = await this.tripModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }

  public async search(
    fromCityId: string,
    toCityId: string,
    departureDate: Date,
    arrivalDate?: Date,
    sortBy: 'fare' | 'duration' | 'departureDate' = 'fare'
  ) {
    let sort = null;
    switch (sortBy) {
      default:
      case 'fare': {
        sort = { $sort: { fare: 1, departureDate: 1, duration: 1 } };
        break;
      }
      case 'departureDate': {
        sort = { $sort: { departureDate: 1, fare: 1, duration: 1 } };
        break;
      }
      case 'duration': {
        sort = { $sort: { duration: 1, departureDate: 1, fare: 1 } };
        break;
      }
    }

    const arrivalCriteria = arrivalDate
      ? { arrivalDate: { $lse: arrivalDate } }
      : {};

    const dbTrip = await this.tripModel.aggregate([
      {
        $match: {
          fromCity: new Types.ObjectId(fromCityId),
          toCity: new Types.ObjectId(toCityId),
          departureDate: { $gte: departureDate },
          ...arrivalCriteria,
        },
      },
      {
        $addFields: {
          duration: {
            $dateDiff: {
              startDate: '$departureDate',
              endDate: '$arrivalDate',
              unit: 'minute',
            },
          },
        },
      },
      {
        ...sort,
      },
    ]);

    return dbTrip.map(TripAdapter.toDomain);
  }
}
