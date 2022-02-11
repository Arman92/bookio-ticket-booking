import morgan from 'morgan';
import express from 'express';
import cors from 'cors';

import config from '@bookio/config';
import log, { customLogStream } from '@bookio/shared/log';
import { errorHandlerMiddleware } from '@bookio/shared/middleware/error-handler';
import { v1Router } from './api/v1';

const server = express();
// In case we are behind something like NGinx and we want to trust the https connections coming from it.
server.set('trust proxy', 1); // trust first proxy

server.use(
  cors({
    origin: (origin, callback) => {
      const whiteList = config.app.corsWhiteList;
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (!whiteList.split(',').includes(origin)) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

// parse application/x-www-form-urlencoded
server.use(
  express.urlencoded({
    extended: true,
  })
);

// Enable Body Parser middleware to parse payloads automatically
server.use(
  express.json({
    limit: '1mb',
  })
);

// Enable HTTP logger if enabled
if (config.log.morgan.enabled) {
  server.use((req, res, next) => {
    // If enabled, add the HTTP requests logging middleware (Morgan)
    morgan(config.log.morgan.level, { stream: customLogStream })(
      req,
      res,
      next
    );
  });
}

server.use(errorHandlerMiddleware);

server.use('/api/v1', v1Router);

server.listen(config.app.port, () => {
  log.info(`Server ready at http://${config.app.host}:${config.app.port}`);
});
