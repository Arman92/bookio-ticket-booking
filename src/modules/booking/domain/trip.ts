import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';

interface TripProps {
  fromStationId: UniqueEntityID;
  toStationId: UniqueEntityID;
  transportVehicleId: UniqueEntityID;
  departureDate: Date;
  arrivalDate: Date;
  fare: number;
  capacity: number;
  stops?: UniqueEntityID[];
}

export class Trip extends Entity<TripProps> {
  public static MAX_FARE = 2000;
  public static MAX_DURATION_MINS = 24 * 60;

  private constructor(props: TripProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get fromStationId() {
    return this.props.fromStationId;
  }

  get toStationId() {
    return this.props.toStationId;
  }

  get transportVehicleId() {
    return this.props.transportVehicleId;
  }

  get departureDate() {
    return this.props.departureDate;
  }

  get arrivalDate() {
    return this.props.arrivalDate;
  }

  get stops() {
    return this.props.stops;
  }

  get fare() {
    return this.props.fare;
  }

  get capacity() {
    return this.props.capacity;
  }

  public static create(props: TripProps, id?: UniqueEntityID): Result<Trip> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.fromStationId, argumentName: 'fromStationId' },
      { argument: props.toStationId, argumentName: 'toStationId' },
      {
        argument: props.transportVehicleId,
        argumentName: 'transportVehicleId',
      },
      {
        argument: props.departureDate,
        argumentName: 'departureDate',
      },
      {
        argument: props.arrivalDate,
        argumentName: 'arrivalDate',
      },
      { argument: props.fare, argumentName: 'fare' },
      { argument: props.capacity, argumentName: 'capacity' },
    ]);

    const fareGuard = Guard.inRange(props.fare, 0, Trip.MAX_FARE, 'fare');
    const capacityRange = Guard.inRange(props.capacity, 1, 1000, 'capacity');

    if (props.arrivalDate <= props.departureDate) {
      return Result.fail('Arrival date should be greater than Departure date.');
    }

    const duration =
      (props.arrivalDate.getTime() - props.departureDate.getTime()) /
      (1000 * 60);

    if (duration > Trip.MAX_DURATION_MINS) {
      return Result.fail(
        `Trip duration exceeds maximum allowed limit ${
          Trip.MAX_DURATION_MINS / 60
        } hours`
      );
    }

    if (!Guard.combine(guardResult, fareGuard, capacityRange).succeeded) {
      return Result.fail<Trip>(
        guardResult.message || fareGuard.message || capacityRange.message
      );
    } else {
      return Result.ok<Trip>(
        new Trip({ ...props, stops: props.stops ? props.stops : [] }, id)
      );
    }
  }
}
