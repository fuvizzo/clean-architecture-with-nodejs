const MongoDbDatabaseServices = require('../frameworks/persistence/mongo-db/database-services');
const RedisCachingServices = require('../frameworks/persistence/redis/caching-services');
const GoogleMapServices = require('../frameworks/external-services/google-maps-services');
const OpenWeatherServices = require('../frameworks/external-services/open-weather-services');

const databaseServices = new MongoDbDatabaseServices();
const cachingServices = new RedisCachingServices();
databaseServices.initDatabase();
cachingServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  cachingServices,
  mapServices: new GoogleMapServices(),
  forecastService: new OpenWeatherServices(),
}))();
