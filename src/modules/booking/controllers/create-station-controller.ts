import { BaseController } from '@shypple/core/infra/BaseController';
import { cityRepo, stationRepo } from '../repos';
import {
  CreateStationDTO,
  CreateStationUseCase,
} from '../use-cases/station/create-station/create-station-use-case';

export class CreateStationController extends BaseController {
  private useCase: CreateStationUseCase;

  constructor(useCase: CreateStationUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const dto: CreateStationDTO = this.req.body as CreateStationDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isSuccess) {
        return this.ok(this.res, result);
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
