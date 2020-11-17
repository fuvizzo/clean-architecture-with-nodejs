/* eslint-disable class-methods-use-this */
const LocationRepository = require('../../../contracts/repositories/location');
const Location = require('./models/location');

module.exports = class MongoDbLocationRepository extends LocationRepository {
  add(locationInstance) {
    const newLocation = Location.findOneAndUpdate({
      address: locationInstance.address,
    }, locationInstance, {
      new: true,
      upsert: true,
    });
    return newLocation;
  }

  update(locationId, data) {
    const location = Location.findByIdAndUpdate(locationId, data, {
      new: true,
    });
    return location;
  }

  getByAddress(addressInstance) {
    return Location.findOne({ address: addressInstance });
  }
};
