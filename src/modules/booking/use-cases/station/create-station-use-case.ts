import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { Station } from '../../domain/station';
import { StationRepo } from '../../repos/station-repo';

export interface CreateStationDTO {
  cityId: string;
  name: string;
  latitude: number;
  longitude: number;
}

export class CreateStationUseCase
  implements UseCase<CreateStationDTO, Result<any>>
{
  private stationRepo: StationRepo;

  constructor(stationRepo: StationRepo) {
    this.stationRepo = stationRepo;
  }

  public async execute(req: CreateStationDTO): Promise<Result<any>> {
    const stationOrError = Station.create({
      cityId: new UniqueEntityID(req.cityId),
      name: req.name,
      latitude: req.latitude,
      longitude: req.longitude,
    });

    if (stationOrError.isFailure) {
      return Result.fail<Station>(stationOrError.errorValue());
    }

    this.stationRepo.save(stationOrError.getValue());

    return null;
  }
}
