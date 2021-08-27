import faker from 'faker';
import log from '@shypple/shared/log';
import { CityModel, StationModel, TransportVehicleModel } from '../models';
import { TransportVehicleType } from '@shypple/modules/booking/domain/transport-vehicle';

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const seedDb = async () => {
  log.info('Looks like we have an empty db, lets seed it...');

  const cities = [];
  const dbCities = [];

  for (let i = 0; i < 2000; i++) {
    cities.push(faker.address.cityName());
  }

  const uniqueCities = [...new Set(cities)];

  for (const city of uniqueCities) {
    const dbCity = await CityModel.create({
      name: city,
    });

    dbCities.push(dbCity);
  }

  for (const dbCity of dbCities) {
    const maxStations = randomNumber(1, 5);
    for (let i = 0; i < maxStations; i++) {
      StationModel.create({
        city: dbCity._id,
        name: faker.name.firstName(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      });
    }
  }

  const amenities = ['WiFi', 'Outlet', 'Phone-Charger'];

  for (let i = 0; i < 10; i++) {
    await TransportVehicleModel.create({
      name: faker.vehicle.manufacturer(),
      type: TransportVehicleType.Bus,
      capacity: randomNumber(10, 45),
      amenities: amenities.slice(0, randomNumber(0, 3)),
    });
  }

  log.info('Finished seeding database!');
};