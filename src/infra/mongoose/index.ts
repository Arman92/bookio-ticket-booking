import mongoose from 'mongoose';
import log from '@shypple/shared/log';

import { dbURI, mongoDbOptions } from './config';

log.info(`Connecting to Mongodb via this URI: ${dbURI}`);

// Connect to the mongodb database
mongoose
  .connect(dbURI, mongoDbOptions)
  .then(async () => {
    mongoose.set('returnOriginal', false);
    log.info(`MongoDb connected!`);
  })
  .catch((err) => {
    log.error(err);
  });
