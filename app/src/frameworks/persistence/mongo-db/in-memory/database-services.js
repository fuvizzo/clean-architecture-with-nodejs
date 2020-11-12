const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoDb = new MongoMemoryServer();

const DatabaseServices = require('../../../../contracts/database-services');
const MongoDbLocationRepository = require('../location-repository');

module.exports = class InMemoryMongoDbDatabaseServices extends DatabaseServices {
  static async initDatabase() {
    const uri = await mongoDb.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connection = await mongoose.connect(uri, mongooseOpts);
    this.locationRepository = new MongoDbLocationRepository();
    return connection;
  }

  /**
   * Drop database, close the connection and stop mongod.
   */
  static async closeDatabase() {
    await mongoose.connection.close();
    await mongoDb.stop();
  }

  /**
   * Remove all the data for all db collections.
   */
  static async clearDatabase() {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};