import { UniqueEntityID } from '@shypple/core/domain';
import { BaseController } from '@shypple/core/infra/BaseController';
import { bookingRepo, stationRepo, tripRepo, userRepo } from '../repos';
import { BookDTO, BookUseCase } from '../use-cases/trip/book-use-case';

export class BookController extends BaseController {
  private useCase: BookUseCase;

  constructor(useCase: BookUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { tripId, userId, seats, destinationStationId } = this.req.body;
    const dto: BookDTO = {
      tripId: new UniqueEntityID(tripId),
      userId: new UniqueEntityID(userId),
      destinationStationId: destinationStationId
        ? new UniqueEntityID(destinationStationId)
        : undefined,
      seats,
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

export const bookController = new BookController(
  new BookUseCase(tripRepo, stationRepo, bookingRepo, userRepo)
);
