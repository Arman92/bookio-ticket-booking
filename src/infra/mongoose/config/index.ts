import config from '@shypple/config';

export const mongoDbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
};

let dbURI = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}?authSource=admin`;

// If there is atlasURI present, use that instead
if (config.db.atlasURI) {
  dbURI = config.db.atlasURI;
}

export { dbURI };
