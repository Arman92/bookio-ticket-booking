import express from 'express';

import {
  stationsRouter,
  citiesRouter,
  tripsRouter,
} from '@bookio/modules/booking/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/stations', stationsRouter);
v1Router.use('/cities', citiesRouter);
v1Router.use('/trips', tripsRouter);

export { v1Router };
