import faker from 'faker';
import { CityModel, StationModel } from '../models';

export const seedDb = async () => {
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
    const maxStations = Math.random() * (5 - 1) + 1;
    for (let i = 0; i < maxStations; i++) {
      StationModel.create({
        city: dbCity._id,
        name: faker.name.firstName(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      });
    }
  }
};
