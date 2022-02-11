import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
import { bookingRepo } from '../repos';
import {
  ReportTripBookingsDTO,
  ReportTripBookingsUseCase,
} from '../use-cases/trip/report-trip-bookings-use-case';

export class ReportTripBookingsController extends BaseController {
  private useCase: ReportTripBookingsUseCase;

  constructor(useCase: ReportTripBookingsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { tripId } = this.req.query;
    const dto: ReportTripBookingsDTO = {
      tripId: new UniqueEntityID(tripId as string),
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

export const reportTripBookingController = new ReportTripBookingsController(
  new ReportTripBookingsUseCase(bookingRepo)
);
