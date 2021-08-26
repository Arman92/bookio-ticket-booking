import { UniqueEntityID } from '@shypple/core/domain';
import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { Booking } from '../../domain/booking';
import { BookDTO } from './book-dto';

export class BookUseCase implements UseCase<BookDTO, Promise<unknown>> {
  async execute(req: BookDTO): Promise<unknown> {
    const { tripId, userId, seats, destinationStationId } = req;

    const bookingOrError = Booking.create({
      tripId: new UniqueEntityID(tripId),
      userId: new UniqueEntityID(userId),
      seats,
      fare: 5, //TODO:
      total_fare: 12, // TODO
      durationInMins: 60, // TODO
      destinationStation: new UniqueEntityID(destinationStationId),
    });

    if (bookingOrError.isFailure) {
      return Result.fail<void>(bookingOrError.error);
    }
  }
}
