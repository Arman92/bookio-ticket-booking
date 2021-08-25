import express from 'express';
import { createStationController } from '../../controllers/create-station-controller';

const stationsRouter = express.Router();

stationsRouter.post(
  '/',
  createStationController.execute.bind(createStationController)
);

export { stationsRouter };
