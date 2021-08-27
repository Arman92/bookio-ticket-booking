import { UniqueEntityID } from '@shypple/core/domain';
import { ITripModel } from '@shypple/infra/mongoose/types/trip-type';
import { Trip } from '../domain/trip';

export class TripAdapter {
  public static toDomain(raw: ITripModel) {
    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(raw.fromStation.toString()),
      toStationId: new UniqueEntityID(raw.toStation.toString()),
      busId: new UniqueEntityID(raw.bus.toString()),
      durationMins: raw.durationMins,
      fare: raw.fare,
      stops: raw.stops.map((stop) => new UniqueEntityID(stop.toString())),
    });

    if (tripOrError.isFailure) throw new Error(tripOrError.error as string);

    return tripOrError.getValue();
  }
}
