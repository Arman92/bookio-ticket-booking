import { isValid as isValidDate } from 'date-fns';

import { UseCase } from '@bookio/core/domain/use-case';
import { Result } from '@bookio/core/logic';
import { NotFoundError, UserInputError } from '@bookio/core/logic/api-errors';
import { TripRepo, CityRepo } from '@bookio/modules/booking/repos';
import { Trip } from '../../domain/trip';
import { UniqueEntityID } from '@bookio/core/domain';

export interface SearchTripDTO {
  fromCityId: UniqueEntityID;
  toCityId: UniqueEntityID;
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
      !isValidDate(req.departureDate) ||
      req.departureDate < new Date()
    ) {
      return Result.fail(new UserInputError('Departure date is invalid.'));
    }

    if (req.arrivalDate) {
      if (!isValidDate(req.arrivalDate) || req.arrivalDate < new Date()) {
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
