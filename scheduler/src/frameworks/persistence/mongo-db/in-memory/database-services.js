/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoDb = new MongoMemoryServer();

const DatabaseServices = require('../../../../contracts/database-services');
const MongoDbLocationRepository = require('../location-repository');

module.exports = class InMemoryMongoDbDatabaseServices extends DatabaseServices {
  async initDatabase() {
    const uri = await mongoDb.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = await mongoose.connect(uri, mongooseOpts);
    this.locationRepository = new MongoDbLocationRepository();
  }

  /**
   * Drop database, close the connection and stop mongod.
   */
  async closeDatabase() {
    await mongoose.connection.close();
    await mongoDb.stop();
  }

  /**
   * Remove all the data for all db collections.
   */
  async clearDatabase() {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];
      collection.deleteMany();
    }
  }
};
