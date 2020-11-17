/* eslint-disable class-methods-use-this */
const LocationRepository = require('../../../contracts/repositories/location');
const Location = require('./models/location');

module.exports = class MongoDbLocationRepository extends LocationRepository {
  update(filter, data) {
    const newLocation = Location.findOneAndUpdate(filter, data, {
      new: true,
    });
    return newLocation;
  }

  getAll() {
    return Location.find();
  }
};
