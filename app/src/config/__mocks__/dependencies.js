const InMemoryMongoDbDatabaseServices = require('../../frameworks/persistence/mongo-db/in-memory/database-services');
const InMemoryRedisCachingServices = require('../../frameworks/persistence/redis/in-memory/caching-services');

const MockedGoogleMapServices = require('../../frameworks/external-services/mocks/google-maps-services');
const MockedOpenWeatherServices = require('../../frameworks/external-services/mocks/open-weather-services');

const databaseServices = new InMemoryMongoDbDatabaseServices();

const cachingServices = new InMemoryRedisCachingServices();

databaseServices.initDatabase();
cachingServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  cachingServices,
  mapServices: MockedGoogleMapServices,
  forecastServices: MockedOpenWeatherServices,
}))();
