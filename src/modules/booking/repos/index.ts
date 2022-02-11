import {
  StationModel,
  CityModel,
  TripModel,
  TransportVehicleModel,
  BookingModel,
  UserModel,
} from '@bookio/infra/mongoose/models';
import { CityRepo } from './city-repo';
import { StationRepo } from './station-repo';
import { TripRepo } from './trip-repo';
import { TransportVehicleRepo } from './transport-vehicle-repo';
import { BookingRepo } from './booking-repo';
import { UserRepo } from '@bookio/modules/user/repos/user-repo';

const stationRepo = new StationRepo(StationModel);
const cityRepo = new CityRepo(CityModel);
const tripRepo = new TripRepo(TripModel, StationModel);
const transportVehicleRepo = new TransportVehicleRepo(TransportVehicleModel);
const bookingRepo = new BookingRepo(BookingModel, TripModel);
const userRepo = new UserRepo(UserModel);

export {
  stationRepo,
  cityRepo,
  tripRepo,
  transportVehicleRepo,
  bookingRepo,
  userRepo,
};

export {
  CityRepo,
  StationRepo,
  TripRepo,
  TransportVehicleRepo,
  BookingRepo,
  UserRepo,
};
