import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { BookingRepo } from '@bookio/modules/booking/repos';
import { UniqueEntityID } from '@bookio/core/domain';

export interface ReportBookingsByDepartureDTO {
  fromCityId: UniqueEntityID;
}

interface TripReportResult {
  totalFare: number;
  count: number;
}

export class ReportBookingsByDepartureUseCase
  implements UseCase<ReportBookingsByDepartureDTO, Result<TripReportResult>>
{
  private bookingRepo: BookingRepo;

  constructor(bookingRepo: BookingRepo) {
    this.bookingRepo = bookingRepo;
  }

  public async execute(
    req: ReportBookingsByDepartureDTO
  ): Promise<Result<TripReportResult>> {
    const tripBookingReport =
      await this.bookingRepo.getBookingsReportByDepartureCity(req.fromCityId);

    return Result.ok(tripBookingReport as any);
  }
}
