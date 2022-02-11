import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
import { bookingRepo, tripRepo, userRepo } from '../repos';
import {
  RefundBookingDTO,
  RefundBookingUseCase,
} from '../use-cases/trip/refund-booking-user-case';

export class RefundBookingController extends BaseController {
  private useCase: RefundBookingUseCase;

  constructor(useCase: RefundBookingUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { bookingId, userId, reason } = this.req.body;

    const dto: RefundBookingDTO = {
      bookingId: new UniqueEntityID(bookingId),
      userId: new UniqueEntityID(userId),
      reason,
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

export const refundBookingController = new RefundBookingController(
  new RefundBookingUseCase(tripRepo, bookingRepo, userRepo)
);
