import { Entity, UniqueEntityID } from '@bookio/core/domain';
import { Result, Guard } from '@bookio/core/logic';

interface StationProps {
  cityId: UniqueEntityID;
  name: string;
  latitude: number;
  longitude: number;
}

export class Station extends Entity<StationProps> {
  private constructor(props: StationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get cityId() {
    return this.props.cityId;
  }

  get name() {
    return this.props.name;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  public static create(
    props: StationProps,
    id?: UniqueEntityID
  ): Result<Station> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.cityId,
        argumentName: 'cityId',
        guardEmptyString: true,
      },
      { argument: props.name, argumentName: 'name', guardEmptyString: true },
      { argument: props.latitude, argumentName: 'latitude' },
      { argument: props.longitude, argumentName: 'longitude' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Station>(guardResult.message);
    } else {
      return Result.ok<Station>(new Station({ ...props }, id));
    }
  }
}
