import { BaseController } from '@shypple/core/infra/BaseController';
import { cityRepo, stationRepo } from '../repos';
import {
  GetCityStationsDTO,
  GetCityStationsUseCase,
} from '../use-cases/city/get-city-stations-use-case';

export class GetCityStationsController extends BaseController {
  private useCase: GetCityStationsUseCase;

  constructor(useCase: GetCityStationsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { cityId } = this.req.params;
    const dto: GetCityStationsDTO = { cityId };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isSuccess) {
        return this.ok(this.res, result.getValue());
      }

      return this.handleError(result.error as any);
    } catch (err) {
      return this.fail(err);
    }
  }
}

export const getCityStationsController = new GetCityStationsController(
  new GetCityStationsUseCase(stationRepo, cityRepo)
);
