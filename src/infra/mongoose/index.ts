import mongoose from 'mongoose';
import log from '@shypple/shared/log';

import { dbURI, mongoDbOptions } from './config';
import { CityModel } from './models';
import { seedDb } from './seeder';

log.info(`Connecting to Mongodb via this URI: ${dbURI}`);

// Connect to the mongodb database
mongoose
  .connect(dbURI, mongoDbOptions)
  .then(async () => {
    mongoose.set('returnOriginal', false);
    log.info(`MongoDb connected!`);

    // Seed the database with fake values, only for testing.
    CityModel.countDocuments()
      .exec()
      .then((count) => {
        if (count === 0) {
          seedDb();
        }
      });
  })
  .catch((err) => {
    log.error(err);
  });
