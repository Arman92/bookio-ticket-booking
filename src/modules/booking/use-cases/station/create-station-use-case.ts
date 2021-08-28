import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { NotFoundError } from '@shypple/core/logic/api-errors';
import { CityRepo } from '@shypple/modules/booking/repos/city-repo';
import { Station } from '../../domain/station';
import { StationRepo } from '../../repos/station-repo';

export interface CreateStationDTO {
  cityId: UniqueEntityID;
  name: string;
  latitude: number;
  longitude: number;
}

export class CreateStationUseCase
  implements UseCase<CreateStationDTO, Result<Station>>
{
  private stationRepo: StationRepo;
  private cityRepo: CityRepo;

  constructor(stationRepo: StationRepo, cityRepo: CityRepo) {
    this.stationRepo = stationRepo;
    this.cityRepo = cityRepo;
  }

  public async execute(req: CreateStationDTO): Promise<Result<Station>> {
    const cityExists = await this.cityRepo.exists(req.cityId);

    if (!cityExists) {
      return Result.fail(new NotFoundError('City does not exist.'));
    }

    const stationOrError = Station.create({
      cityId: req.cityId,
      name: req.name,
      latitude: req.latitude,
      longitude: req.longitude,
    });

    if (stationOrError.isFailure) {
      return Result.fail(stationOrError.errorValue());
    }

    const dbStation = await this.stationRepo.save(stationOrError.getValue());

    return Result.ok(dbStation);
  }
}
