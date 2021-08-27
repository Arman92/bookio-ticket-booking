import {
  StationModel,
  CityModel,
  TripModel,
  TransportVehicleModel,
} from '@shypple/infra/mongoose/models';
import { CityRepo } from './city-repo';
import { StationRepo } from './station-repo';
import { TripRepo } from './trip-repo';
import { TransportVehicleRepo } from './transport-vehicle-repo';

const stationRepo = new StationRepo(StationModel);
const cityRepo = new CityRepo(CityModel);
const tripRepo = new TripRepo(TripModel);
const transportVehicleRepo = new TransportVehicleRepo(TransportVehicleModel);

export { stationRepo, cityRepo, tripRepo, transportVehicleRepo };

export { CityRepo, StationRepo, TripRepo, TransportVehicleRepo };
