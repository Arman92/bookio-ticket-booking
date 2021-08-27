import { ICityModel } from '@shypple/infra/mongoose/types/city-type';
import { City } from '../domain/city';

export class CityAdapter {
  public static toDomain(raw: ICityModel) {
    const cityOrError = City.create(
      {
        name: raw.name,
      },
      raw.id || raw._id
    );

    if (cityOrError.isFailure) throw new Error(cityOrError.error as string);

    return cityOrError.getValue();
  }
}
