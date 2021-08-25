import express from 'express';

import { stationsRouter } from '@shypple/modules/booking/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/stations', stationsRouter);

export { v1Router };
