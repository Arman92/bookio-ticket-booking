import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
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
    const { from, to, departure, arrival, sortBy } = this.req.query as {
      [key: string]: string | null;
    };

    const dto: SearchTripDTO = {
      fromCityId: new UniqueEntityID(from),
      toCityId: new UniqueEntityID(to),
      departureDate: new Date(departure),
      arrivalDate: arrival ? new Date(arrival) : undefined,
      sortBy: sortBy as SearchTripDTO['sortBy'],
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
