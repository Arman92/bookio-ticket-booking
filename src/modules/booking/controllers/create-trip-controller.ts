import { BaseController } from '@shypple/core/infra/BaseController';
import { tripRepo, stationRepo, transportVehicleRepo } from '../repos';
import {
  CreateTripDTO,
  CreateTripUseCase,
} from '../use-cases/trip/create-trip-use-case';

export class CreateTripController extends BaseController {
  private useCase: CreateTripUseCase;

  constructor(useCase: CreateTripUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const dto: CreateTripDTO = this.req.body as CreateTripDTO;

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

export const createTripController = new CreateTripController(
  new CreateTripUseCase(tripRepo, stationRepo, transportVehicleRepo)
);
