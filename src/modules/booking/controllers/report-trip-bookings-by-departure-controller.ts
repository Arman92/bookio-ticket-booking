import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
import { bookingRepo } from '../repos';
import {
  ReportBookingsByDepartureDTO,
  ReportBookingsByDepartureUseCase,
} from '../use-cases/trip/report-bookings-by-departure-use-case';

export class ReportBookingsByDepartureController extends BaseController {
  private useCase: ReportBookingsByDepartureUseCase;

  constructor(useCase: ReportBookingsByDepartureUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const { fromCity } = this.req.query;
    const dto: ReportBookingsByDepartureDTO = {
      fromCityId: new UniqueEntityID(fromCity as string),
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

export const reportBookingsByDepartureController =
  new ReportBookingsByDepartureController(
    new ReportBookingsByDepartureUseCase(bookingRepo)
  );
