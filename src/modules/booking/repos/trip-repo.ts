import mongoose from 'mongoose';

import { Repo } from '@shypple/core/infra/Repo';
import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../domain/trip';
import { ITripModel } from '@shypple/infra/mongoose/types/trip-type';
import { TripAdapter } from '../adapters/trip-adapter';

export interface ITripRepo extends Repo<Trip> {
  findById(id: UniqueEntityID): Promise<Trip>;
  removeById(id: UniqueEntityID): Promise<boolean>;
}

export class TripRepo implements ITripRepo {
  private tripModel: mongoose.Model<ITripModel>;

  constructor(tripModel: mongoose.Model<ITripModel>) {
    this.tripModel = tripModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.tripModel.exists({ _id: id });
  }

  public async save(trip: Trip) {
    const updated = await this.tripModel.findOneAndUpdate(
      { _id: trip.id },
      {
        toStation: trip.toStationId.toString(),
        fromStation: trip.fromStationId.toString(),
        bus: trip.transportVehicleId.toString(),
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
}
