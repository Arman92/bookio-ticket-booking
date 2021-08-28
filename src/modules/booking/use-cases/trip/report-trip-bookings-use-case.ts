import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { BookingRepo } from '@shypple/modules/booking/repos';
import { UniqueEntityID } from '@shypple/core/domain';

export interface ReportTripBookingsDTO {
  tripId: UniqueEntityID;
}

interface TripReportResult {
  totalFare: number;
  count: number;
}

export class ReportTripBookingsUseCase
  implements UseCase<ReportTripBookingsDTO, Result<TripReportResult>>
{
  private bookingRepo: BookingRepo;

  constructor(bookingRepo: BookingRepo) {
    this.bookingRepo = bookingRepo;
  }

  public async execute(
    req: ReportTripBookingsDTO
  ): Promise<Result<TripReportResult>> {
    const tripBookingReport = await this.bookingRepo.getBookingsReportByTrip(
      req.tripId
    );

    return Result.ok(tripBookingReport as any);
  }
}
