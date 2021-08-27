import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { NotFoundError } from '@shypple/core/logic/api-errors';
import { CityRepo } from '@shypple/modules/booking/repos/city-repo';
import { Station } from '../../domain/station';
import { StationRepo } from '../../repos';

export interface GetCityStationsDTO {
  cityId: string;
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
