module.exports = {
  type: 'mongodb',
  database: process.env.MONGODB_NAME,
  url: process.env.MONGODB_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: ['server/entity/**/*.ts'],
  migrations: ['server/migration/**/*.ts'],
  subscribers: ['server/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'server/entity',
    migrationsDir: 'server/migration',
    subscribersDir: 'server/subscriber',
  },
};
