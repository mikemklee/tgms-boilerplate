const fileExtension = process.env.NODE_ENV === 'development' ? 'ts' : 'js';

const entitiesDir =
  process.env.NODE_ENV === 'development' ? 'server/entity' : 'dist/entity';

const migrationsDir =
  process.env.NODE_ENV === 'development'
    ? 'server/migration'
    : 'dist/migration';

const subscribersDir =
  process.env.NODE_ENV === 'development'
    ? 'server/subscriber'
    : 'dist/subscriber';

module.exports = {
  type: 'mongodb',
  database: process.env.MONGODB_NAME,
  url: process.env.MONGODB_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: [`${entitiesDir}/**/*.${fileExtension}`],
  migrations: [`${migrationsDir}/**/*.${fileExtension}`],
  subscribers: [`${subscribersDir}/**/*.${fileExtension}`],
  cli: {
    entitiesDir: entitiesDir,
    migrationsDir: migrationsDir,
    subscribersDir: subscribersDir,
  },
};
