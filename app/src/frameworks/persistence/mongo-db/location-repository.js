const LocationRepository = require('../../../contracts/repositories/location');
const Location = require('./models/location');

module.exports = class MongoDbLocationRepository extends LocationRepository {
  constructor() {
    super();
    this.locations = [];
  }

  add(locationInstance) {
    const newLocation = Location.findOneAndUpdate({
      address: locationInstance.address,
    }, locationInstance, {
      new: true,
      upsert: true,
    });
    this.locations.push(locationInstance);
    return newLocation;
  }

  getByAddress(addressInstance) {
    return Location.findOne({ address: addressInstance });
  }
};
