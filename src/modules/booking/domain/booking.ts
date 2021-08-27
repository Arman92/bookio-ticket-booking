import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';
import { Trip } from './trip';

interface BookingProps {
  tripId: UniqueEntityID;
  userId: UniqueEntityID;
  seats: number;
  fare: number;
  total_fare: number;
  destinationStation: UniqueEntityID;
  durationInMins: number;
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

  get total_fare() {
    return this.props.total_fare;
  }

  get destinationStation() {
    return this.props.destinationStation;
  }

  get durationInMins() {
    return this.props.durationInMins;
  }

  public static create(
    props: BookingProps,
    id?: UniqueEntityID
  ): Result<Booking> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.tripId, argumentName: 'tripId' },
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.seats, argumentName: 'seats' },
      { argument: props.fare, argumentName: 'fare' },
      { argument: props.total_fare, argumentName: 'total_fare' },
      {
        argument: props.destinationStation,
        argumentName: 'destinationStation',
      },
      { argument: props.durationInMins, argumentName: 'durationInMins' },
    ]);

    const durationGuard = Guard.inRange(
      props.durationInMins,
      1,
      Trip.MAX_DURATION_MINS,
      'durationInMins'
    );

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
      !Guard.combine(
        guardResult,
        durationGuard,
        fareGuard,
        seatsGuard,
        totalFareGuard
      ).succeeded
    ) {
      return Result.fail<Booking>(
        guardResult.message ||
          durationGuard.message ||
          fareGuard.message ||
          seatsGuard.message ||
          totalFareGuard.message
      );
    } else {
      return Result.ok<Booking>(new Booking({ ...props }, id));
    }
  }
}
