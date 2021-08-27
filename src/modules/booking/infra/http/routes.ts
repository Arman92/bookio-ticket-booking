import express from 'express';
import { createStationController } from '../../controllers/create-station-controller';
import { createTripController } from '../../controllers/create-trip-controller';
import { getCityStationsController } from '../../controllers/get-city-stations-controller';
import { searchCitiesController } from '../../controllers/search-cities-controller';

const stationsRouter = express.Router();
const citiesRouter = express.Router();
const tripsRouter = express.Router();

stationsRouter.post(
  '/',
  createStationController.execute.bind(createStationController)
);

citiesRouter.get(
  '/:cityId/stations',
  getCityStationsController.execute.bind(getCityStationsController)
);

citiesRouter.get(
  '/search',
  searchCitiesController.execute.bind(searchCitiesController)
);

tripsRouter.post('/', createTripController.execute.bind(createTripController));

export { stationsRouter, citiesRouter, tripsRouter };
