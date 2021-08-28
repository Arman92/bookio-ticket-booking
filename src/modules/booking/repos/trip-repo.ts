import mongoose, { Types } from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../domain/trip';
import { ITripModel } from '@shypple/infra/mongoose/types/trip-type';
import { TripAdapter } from '../adapters/trip-adapter';
import { IStationModel } from '@shypple/infra/mongoose/types/station-type';
import { bookingRepo } from './';

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
      { upsert: true, useFindAndModify: false, new: true }
    );

    return TripAdapter.toDomain(updated);
  }

  public async findById(id: UniqueEntityID) {
    const dbTrip = await this.tripModel.findById(id);

    return TripAdapter.toDomain(dbTrip);
  }

  public async removeById(id: UniqueEntityID) {
    try {
      const res = await this.tripModel.remove({ _id: id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }

  public async getCapacity(tripId: UniqueEntityID) {
    const trip = await this.tripModel.findById(tripId);

    if (trip) {
      return (
        trip.capacity - (await bookingRepo.getReservedBookingsCount(tripId))
      );
    }

    return 0;
  }

  public async reduceCapacity(tripId: UniqueEntityID, count: number) {
    const trip = await this.tripModel.findById(tripId);

    if (trip.capacity - count >= 0) {
      const updated = await this.tripModel.findOneAndUpdate(
        { _id: trip.id },
        {
          $set: {
            capacity: trip.capacity - count,
          },
        },
        { upsert: true, useFindAndModify: false, new: true }
      );

      return TripAdapter.toDomain(updated);
    }

    return null;
  }

  public async increaseCapacity(tripId: UniqueEntityID, count: number) {
    const trip = await this.tripModel.findById(tripId);

    const updated = await this.tripModel.findOneAndUpdate(
      { _id: trip.id },
      {
        $set: {
          capacity: trip.capacity + count,
        },
      },
      { upsert: true, useFindAndModify: false, new: true }
    );

    return TripAdapter.toDomain(updated);
  }

  public async search(
    fromCityId: UniqueEntityID,
    toCityId: UniqueEntityID,
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
          fromCity: Types.ObjectId(fromCityId.toString()),
          toCity: Types.ObjectId(toCityId.toString()),
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
        $lookup: {
          from: 'cities',
          localField: 'fromCity',
          foreignField: '_id',
          as: 'fromCity',
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'toCity',
          foreignField: '_id',
          as: 'toCity',
        },
      },
      {
        $lookup: {
          from: 'stations',
          localField: 'fromStation',
          foreignField: '_id',
          as: 'fromStation',
        },
      },
      {
        $lookup: {
          from: 'stations',
          localField: 'toStation',
          foreignField: '_id',
          as: 'toStation',
        },
      },
      {
        $lookup: {
          from: 'transportvehicles',
          localField: 'transportVehicle',
          foreignField: '_id',
          as: 'transportVehicle',
        },
      },
      {
        ...sort,
      },
      {
        $project: {
          __v: 0,
          fromCity: { createdAt: 0, updatedAt: 0, __v: 0 },
          fromStation: { createdAt: 0, updatedAt: 0, __v: 0 },
          toCity: { createdAt: 0, updatedAt: 0, __v: 0 },
          toStation: { createdAt: 0, updatedAt: 0, __v: 0 },
          transportVehicle: { createdAt: 0, updatedAt: 0, __v: 0 },
        },
      },
      {
        $project: {
          _id: 1,
          arrivalDate: 1,
          departureDate: 1,
          fare: 1,
          capacity: 1,
          fromCity: { $first: '$fromCity' },
          fromStation: { $first: '$fromStation' },
          toCity: { $first: '$toCity' },
          toStation: { $first: '$toStation' },
          transportVehicle: { $first: '$transportVehicle' },
        },
      },
    ]);

    return dbTrip as any;
  }
}
