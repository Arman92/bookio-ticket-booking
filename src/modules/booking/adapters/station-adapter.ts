import { UniqueEntityID } from '@shypple/core/domain';
import { IStationModel } from '@shypple/infra/mongoose/types/station-type';
import { Station } from '../domain/station';

export class StationAdapter {
  public static toDomain(raw: IStationModel) {
    const stationOrError = Station.create(
      {
        cityId: new UniqueEntityID(raw.city.toString()),
        name: raw.name,
        latitude: raw.latitude,
        longitude: raw.longitude,
      },
      raw.id || raw._id
    );

    if (stationOrError.isFailure)
      throw new Error(stationOrError.error as string);

    return stationOrError.getValue();
  }
}
