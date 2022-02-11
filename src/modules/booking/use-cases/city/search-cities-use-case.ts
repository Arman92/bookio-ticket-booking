import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { CityRepo } from '@bookio/modules/booking/repos/city-repo';
import { City } from '../../domain/city';

export interface SearchCitiesDTO {
  partialName: string;
}

export class SearchCitiesUseCase
  implements UseCase<SearchCitiesDTO, Result<City[]>>
{
  private cityRepo: CityRepo;

  constructor(cityRepo: CityRepo) {
    this.cityRepo = cityRepo;
  }

  public async execute(req: SearchCitiesDTO): Promise<Result<City[]>> {
    const cities = await this.cityRepo.search(req.partialName);

    return Result.ok(cities);
  }
}
