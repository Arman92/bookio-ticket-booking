import express from 'express';
import { createStationController } from '../../controllers/create-station-controller';
import { getCityStationsController } from '../../controllers/get-city-stations-controller';

const stationsRouter = express.Router();
const citiesRouter = express.Router();

stationsRouter.post(
  '/',
  createStationController.execute.bind(createStationController)
);

citiesRouter.get(
  '/:cityId/stations',
  getCityStationsController.execute.bind(getCityStationsController)
);

export { stationsRouter, citiesRouter };
