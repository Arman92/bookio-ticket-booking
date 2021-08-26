import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';

enum TransportVehicleType {
  Bus = 'bus',
  MiniBus = 'mini-bus',
  Train = 'train',
}

interface TransportVehicleProps {
  name: string;
  type: TransportVehicleType;
  capacity: number;
  amenities: string[];
}

export class TransportVehicle extends Entity<TransportVehicleProps> {
  private constructor(props: TransportVehicleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name() {
    return this.props.name;
  }

  get type() {
    return this.props.type;
  }

  get capacity() {
    return this.props.capacity;
  }

  get amenities() {
    return this.props.amenities;
  }

  public static create(
    props: TransportVehicleProps,
    id?: UniqueEntityID
  ): Result<TransportVehicle> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.type, argumentName: 'type' },
      { argument: props.capacity, argumentName: 'capacity' },
    ]);

    const capacityRange = Guard.inRange(props.capacity, 1, 1000, 'capacity');

    if (!Guard.combine(guardResult, capacityRange)) {
      return Result.fail<TransportVehicle>(guardResult.message);
    } else {
      return Result.ok<TransportVehicle>(
        new TransportVehicle(
          {
            ...props,
            amenities: props.amenities ? props.amenities : [],
          },
          id
        )
      );
    }
  }
}
