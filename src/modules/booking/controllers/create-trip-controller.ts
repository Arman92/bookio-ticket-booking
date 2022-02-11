import { UniqueEntityID } from '@bookio/core/domain';
import { BaseController } from '@bookio/core/infra/BaseController';
import { tripRepo, stationRepo, transportVehicleRepo } from '../repos';
import {
  CreateTripDTO,
  CreateTripUseCase,
} from '../use-cases/trip/create-trip-use-case';

export class CreateTripController extends BaseController {
  private useCase: CreateTripUseCase;

  constructor(useCase: CreateTripUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const {
      fromStationId,
      toStationId,
      transportVehicleId,
      departureDate,
      arrivalDate,
      fare,
      stops,
    } = this.req.body;

    const dto: CreateTripDTO = {
      fromStationId: new UniqueEntityID(fromStationId),
      toStationId: new UniqueEntityID(toStationId),
      transportVehicleId: new UniqueEntityID(transportVehicleId),
      departureDate,
      arrivalDate,
      fare,
      stops:
        stops && stops.length
          ? stops.map((stop: string) => new UniqueEntityID(stop))
          : undefined,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isSuccess) {
        return this.created(this.res, result.getValue());
      }

      return this.handleError(result.error as any);
    } catch (err) {
      return this.fail(err);
    }
  }
}

export const createTripController = new CreateTripController(
  new CreateTripUseCase(tripRepo, stationRepo, transportVehicleRepo)
);
