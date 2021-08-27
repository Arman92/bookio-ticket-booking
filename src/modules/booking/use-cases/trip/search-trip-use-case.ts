import { isValid } from 'date-fns';

import { UseCase } from '@shypple/core/domain/use-case';
import { Result } from '@shypple/core/logic';
import { NotFoundError, UserInputError } from '@shypple/core/logic/api-errors';
import { TripRepo, CityRepo } from '@shypple/modules/booking/repos';
import { Trip } from '../../domain/trip';

export interface SearchTripDTO {
  fromCityId: string;
  toCityId: string;
  departureDate: Date;
  arrivalDate?: Date;
  sortBy?: 'fare' | 'duration' | 'departureDate';
}

export class SearchTripsUseCase
  implements UseCase<SearchTripDTO, Result<Trip>>
{
  private tripRepo: TripRepo;
  private cityRepo: CityRepo;

  constructor(tripRepo: TripRepo, cityRepo: CityRepo) {
    this.tripRepo = tripRepo;
    this.cityRepo = cityRepo;
  }

  public async execute(req: SearchTripDTO): Promise<Result<Trip>> {
    const fromCityExists = await this.cityRepo.exists(req.fromCityId);
    const toCityExists = await this.cityRepo.exists(req.toCityId);

    if (!fromCityExists) {
      return Result.fail(new NotFoundError('From City does not exist.'));
    }

    if (!toCityExists) {
      return Result.fail(new NotFoundError('To City does not exist.'));
    }

    if (
      !req.departureDate ||
      !isValid(req.departureDate)
      // || req.departureDate < new Date()
    ) {
      return Result.fail(new UserInputError('Departure date is invalid.'));
    }

    if (req.arrivalDate) {
      if (
        !isValid(req.arrivalDate)
        // || req.arrivalDate < new Date()
      ) {
        return Result.fail(new UserInputError('Arrival date is invalid.'));
      }
    }

    const dbTrips = await this.tripRepo.search(
      req.fromCityId,
      req.toCityId,
      req.departureDate,
      req.arrivalDate,
      req.sortBy
    );

    return Result.ok(dbTrips);
  }
}
