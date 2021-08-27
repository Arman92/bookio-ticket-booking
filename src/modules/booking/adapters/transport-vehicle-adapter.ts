import { ITransportVehicleModel } from '@shypple/infra/mongoose/types/transport-vehicle-type';
import { TransportVehicle } from '../domain/transport-vehicle';

export class TransportVehicleAdapter {
  public static toDomain(raw: ITransportVehicleModel) {
    const transportVehicleOrError = TransportVehicle.create(
      {
        name: raw.name,
        capacity: raw.capacity,
        type: raw.type,
        amenities: raw.amenities,
      },
      raw.id
    );

    if (transportVehicleOrError.isFailure)
      throw new Error(transportVehicleOrError.error as string);

    return transportVehicleOrError.getValue();
  }
}
