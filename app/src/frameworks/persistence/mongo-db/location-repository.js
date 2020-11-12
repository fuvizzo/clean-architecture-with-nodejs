const LocationRepository = require('../../../contracts/repositories/location');
const Location = require('./models/location');

module.exports = class MongoDbLocationRepository extends LocationRepository {
  constructor() {
    super();
    this.locations = [];
    this.currentId = null;
  }

  add(locationInstance) {
    const newLocation = new Location(locationInstance);
    this.locations.push(newLocation);
    return newLocation.save();
  }
};
