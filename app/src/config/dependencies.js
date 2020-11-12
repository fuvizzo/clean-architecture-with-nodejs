const MongoDbDatabaseServices = require('../frameworks/persistence/mongo-db/database-services');
const GoogleMapServices = require('../frameworks/external-services/google/maps-api.js');

const databaseServices = new MongoDbDatabaseServices();
databaseServices.initDatabase();

module.exports = (() => ({
  databaseServices,
  // googleMapServices: new GoogleMapServices(),
}))();
