const InMemoryDatabaseServices = require('../../frameworks/persistence/mongo-db/in-memory/database-services');
const MockedGoogleMapServices = require('../../frameworks/external-services/mocks/google-maps-services');
const MockedOpenWeatherServices = require('../../frameworks/external-services/mocks/open-weather-services');

const databaseServices = new InMemoryDatabaseServices();
databaseServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  //cacheServices,
  googleMapServices: MockedGoogleMapServices,
  openWeatherServices: MockedOpenWeatherServices,
}))();
