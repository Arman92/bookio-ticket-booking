import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';

interface CityProps {
  name: string;
}

export class City extends Entity<CityProps> {
  private constructor(props: CityProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name() {
    return this.props.name;
  }

  public static create(props: CityProps, id?: UniqueEntityID): Result<City> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name', guardEmptyString: true },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<City>(guardResult.message);
    } else {
      return Result.ok<City>(new City({ ...props }, id));
    }
  }
}
