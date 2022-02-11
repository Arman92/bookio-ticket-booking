import { Entity, UniqueEntityID } from '@bookio/core/domain';
import { Result, Guard } from '@bookio/core/logic';
import { Trip } from './trip';

interface BookingProps {
  tripId: UniqueEntityID;
  userId: UniqueEntityID;
  seats: number;
  fare: number;
  totalFare: number;
  destinationStation: UniqueEntityID;
}

export class Booking extends Entity<BookingProps> {
  public static MAX_BOOKABLE_SEATS = 50;

  private constructor(props: BookingProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get tripId() {
    return this.props.tripId;
  }

  get userId() {
    return this.props.userId;
  }

  get seats() {
    return this.props.seats;
  }

  get fare() {
    return this.props.fare;
  }

  get totalFare() {
    return this.props.totalFare;
  }

  get destinationStation() {
    return this.props.destinationStation;
  }

  public static create(
    props: BookingProps,
    id?: UniqueEntityID
  ): Result<Booking> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.tripId,
        argumentName: 'tripId',
        guardEmptyString: true,
      },
      {
        argument: props.userId,
        argumentName: 'userId',
        guardEmptyString: true,
      },
      { argument: props.seats, argumentName: 'seats' },
      { argument: props.fare, argumentName: 'fare' },
      { argument: props.totalFare, argumentName: 'totalFare' },
      {
        argument: props.destinationStation,
        argumentName: 'destinationStation',
      },
    ]);

    const fareGuard = Guard.inRange(props.fare, 0, Trip.MAX_FARE, 'fare');
    const totalFareGuard = Guard.inRange(
      props.fare,
      0,
      Booking.MAX_BOOKABLE_SEATS * Trip.MAX_FARE,
      'fare'
    );
    const seatsGuard = Guard.inRange(
      props.seats,
      1,
      Booking.MAX_BOOKABLE_SEATS,
      'fare'
    );

    if (
      !Guard.combine(guardResult, fareGuard, seatsGuard, totalFareGuard)
        .succeeded
    ) {
      return Result.fail<Booking>(
        guardResult.message ||
          fareGuard.message ||
          seatsGuard.message ||
          totalFareGuard.message
      );
    } else {
      return Result.ok<Booking>(new Booking({ ...props }, id));
    }
  }
}
