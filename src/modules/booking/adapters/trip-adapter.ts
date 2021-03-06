import { UniqueEntityID } from '@bookio/core/domain';
import { ITripModel } from '@bookio/infra/mongoose/types/trip-type';
import { Trip } from '../domain/trip';

export class TripAdapter {
  public static toDomain(raw: ITripModel) {
    if (raw) {
      const tripOrError = Trip.create(
        {
          fromStationId: new UniqueEntityID(raw.fromStation.toString()),
          toStationId: new UniqueEntityID(raw.toStation.toString()),
          transportVehicleId: new UniqueEntityID(
            raw.transportVehicle.toString()
          ),
          departureDate: raw.departureDate,
          arrivalDate: raw.arrivalDate,
          fare: raw.fare,
          stops: raw.stops.map((stop) => new UniqueEntityID(stop.toString())),
          capacity: raw.capacity,
        },
        raw.id || raw._id
      );

      if (tripOrError.isFailure) throw new Error(tripOrError.error as string);

      return tripOrError.getValue();
    }

    return null;
  }
}
