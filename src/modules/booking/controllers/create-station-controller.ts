import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
import { cityRepo, stationRepo } from '../repos';
import {
  CreateStationDTO,
  CreateStationUseCase,
} from '../use-cases/station/create-station-use-case';

export class CreateStationController extends BaseController {
  private useCase: CreateStationUseCase;

  constructor(useCase: CreateStationUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { cityId, name, latitude, longitude } = this.req.body;

    const dto: CreateStationDTO = {
      cityId: new UniqueEntityID(cityId),
      name,
      latitude,
      longitude,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isSuccess) {
        return this.created(this.res, result.getValue());
      }

      return this.handleError(result.error as any);
    } catch (err) {
      return this.fail(err);
    }
  }
}

export const createStationController = new CreateStationController(
  new CreateStationUseCase(stationRepo, cityRepo)
);
