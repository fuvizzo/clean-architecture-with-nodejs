const MongoDbDatabaseServices = require('../frameworks/persistence/mongo-db/database-services');
const OpenWeatherServices = require('../frameworks/external-services/open-weather-services');

const databaseServices = new MongoDbDatabaseServices();

databaseServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  forecastServices: OpenWeatherServices,
}))();
