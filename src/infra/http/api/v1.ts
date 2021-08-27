import express from 'express';

import {
  stationsRouter,
  citiesRouter,
} from '@shypple/modules/booking/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/stations', stationsRouter);
v1Router.use('/cities', citiesRouter);

export { v1Router };
