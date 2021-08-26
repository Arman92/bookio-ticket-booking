import { IStationModel } from '@shypple/infra/mongoose/types/station-type';
import { Station } from '../domain/station';

export class StationAdapter {
  public static toDomain(raw: IStationModel) {
    const stationOrError = Station.create({
      cityId: raw.id,
      name: raw.name,
      latitude: raw.latitude,
      longitude: raw.longitude,
    });

    if (stationOrError.isFailure)
      throw new Error(stationOrError.error as string);

    return stationOrError.getValue();
  }
}
