import { BaseController } from '@shypple/core/infra/BaseController';
import { bookingRepo, tripRepo, userRepo } from '../repos';
import {
  ReserveBookingDTO,
  ReserveBookingUseCase,
} from '../use-cases/trip/reserve-booking-use-case';

export class ReserveBookingController extends BaseController {
  private useCase: ReserveBookingUseCase;

  constructor(useCase: ReserveBookingUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const dto: ReserveBookingDTO = this.req.body as ReserveBookingDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isSuccess) {
        return this.created(this.res);
      }

      return this.handleError(result.error as any);
    } catch (err) {
      return this.fail(err);
    }
  }
}

export const reserveBookingController = new ReserveBookingController(
  new ReserveBookingUseCase(tripRepo, bookingRepo, userRepo)
);
