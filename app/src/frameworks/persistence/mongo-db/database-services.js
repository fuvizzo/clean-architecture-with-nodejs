const mongoose = require('mongoose');
const DatabaseServices = require('../../../contracts/database-services');
const MongoDbLocationRepository = require('./location-repository');

module.exports = class MongoDbDatabaseServices extends DatabaseServices {
  async initDatabase() {
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connection = await mongoose.connect(
      process.env.MONGO_URL,
      mongooseOpts,
    );
    this.locationRepository = new MongoDbLocationRepository();
    return connection;
  }
};
