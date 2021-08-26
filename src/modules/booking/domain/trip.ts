import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';

interface TripProps {
  fromStationId: UniqueEntityID;
  toStationId: UniqueEntityID;
  busId: UniqueEntityID;
  durationMins: number;
  fare: number;
  stops?: UniqueEntityID[];
}

export class Trip extends Entity<TripProps> {
  public static MAX_FARE = 2000;

  private constructor(props: TripProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get fromStationId() {
    return this.props.fromStationId;
  }

  get toStationId() {
    return this.props.toStationId;
  }

  get busId() {
    return this.props.busId;
  }

  get durationMins() {
    return this.props.durationMins;
  }

  get stops() {
    return this.props.stops;
  }

  get fare() {
    return this.props.fare;
  }

  public static create(props: TripProps, id?: UniqueEntityID): Result<Trip> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.fromStationId, argumentName: 'fromStationId' },
      { argument: props.toStationId, argumentName: 'toStationId' },
      { argument: props.busId, argumentName: 'busId' },
      { argument: props.durationMins, argumentName: 'durationMins' },
      { argument: props.fare, argumentName: 'fare' },
    ]);

    const durationGuard = Guard.inRange(
      props.durationMins,
      1,
      24 * 60,
      'durationMins'
    );

    const fareGuard = Guard.inRange(props.fare, 0, this.MAX_FARE, 'fare');

    if (!Guard.combine(guardResult, durationGuard, fareGuard).succeeded) {
      return Result.fail<Trip>(
        guardResult.message || durationGuard.message || fareGuard.message
      );
    } else {
      return Result.ok<Trip>(
        new Trip({ ...props, stops: props.stops ? props.stops : [] }, id)
      );
    }
  }
}
