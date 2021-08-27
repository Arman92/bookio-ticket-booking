import { BaseController } from '@shypple/core/infra/BaseController';
import { tripRepo, cityRepo } from '../repos';
import {
  SearchTripDTO,
  SearchTripsUseCase,
} from '../use-cases/trip/search-trip-use-case';

export class SearchTripsController extends BaseController {
  private useCase: SearchTripsUseCase;

  constructor(useCase: SearchTripsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { from, to, departure, arrival } = this.req.query as {
      [key: string]: string | null;
    };

    const dto: SearchTripDTO = {
      fromCityId: from,
      toCityId: to,
      departureDate: new Date(departure),
      arrivalDate: arrival ? new Date(arrival) : undefined,
    };

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

export const searchTripsController = new SearchTripsController(
  new SearchTripsUseCase(tripRepo, cityRepo)
);
