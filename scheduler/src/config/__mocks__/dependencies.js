const InMemoryMongoDbDatabaseServices = require('../../frameworks/persistence/mongo-db/in-memory/database-services');

const MockedOpenWeatherServices = require('../../frameworks/external-services/mocks/open-weather-services');

const databaseServices = new InMemoryMongoDbDatabaseServices();

databaseServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  forecastServices: MockedOpenWeatherServices,
}))();
