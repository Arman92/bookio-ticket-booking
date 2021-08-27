import { UniqueEntityID } from '@shypple/core/domain';
import { IBookingModel } from '@shypple/infra/mongoose/types/booking-type';
import { Booking } from '../domain/booking';

export class BookingAdapter {
  public static toDomain(raw: IBookingModel) {
    const bookingOrError = Booking.create(
      {
        tripId: new UniqueEntityID(raw.trip.toString()),
        userId: new UniqueEntityID(raw.user.toString()),
        seats: raw.seats,
        fare: raw.fare,
        totalFare: raw.totalFare,
        destinationStation: new UniqueEntityID(
          raw.destinationStation.toString()
        ),
      },
      raw.id || raw._id
    );

    if (bookingOrError.isFailure)
      throw new Error(bookingOrError.error as string);

    return bookingOrError.getValue();
  }
}
