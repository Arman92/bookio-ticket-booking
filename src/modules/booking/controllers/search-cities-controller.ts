import { BaseController } from '@bookio/core/infra/BaseController';
import { cityRepo } from '../repos';
import {
  SearchCitiesDTO,
  SearchCitiesUseCase,
} from '../use-cases/city/search-cities-use-case';

export class SearchCitiesController extends BaseController {
  private useCase: SearchCitiesUseCase;

  constructor(useCase: SearchCitiesUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { query } = this.req.query;
    const dto: SearchCitiesDTO = { partialName: query as string };

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

export const searchCitiesController = new SearchCitiesController(
  new SearchCitiesUseCase(cityRepo)
);
