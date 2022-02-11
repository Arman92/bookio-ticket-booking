import { UniqueEntityID } from '@bookio/core/domain';
import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { NotFoundError } from '@bookio/core/logic/api-errors';
import { CityRepo } from '@bookio/modules/booking/repos/city-repo';
import { Station } from '../../domain/station';
import { StationRepo } from '../../repos';

export interface GetCityStationsDTO {
  cityId: UniqueEntityID;
}

export class GetCityStationsUseCase
  implements UseCase<GetCityStationsDTO, Result<Station[]>>
{
  private stationRepo: StationRepo;
  private cityRepo: CityRepo;

  constructor(stationRepo: StationRepo, cityRepo: CityRepo) {
    this.stationRepo = stationRepo;
    this.cityRepo = cityRepo;
  }

  public async execute(req: GetCityStationsDTO): Promise<Result<Station[]>> {
    const cityExists = await this.cityRepo.exists(req.cityId);

    if (!cityExists) {
      return Result.fail(new NotFoundError('City does not exist.'));
    }

    const stations = await this.stationRepo.findByCityId(req.cityId);

    return Result.ok(stations);
  }
}
