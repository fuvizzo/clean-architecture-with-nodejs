const GoogleMapServices = require('../../../contracts/maps-services');

module.exports = class InMemoryGoogleMapServices extends GoogleMapServices {
  static geocode(addressInstance) {
    return new Promise((resolve, reject) => {
      if (addressInstance.country === 'IT') {
        resolve({});
      } else { reject(new Error('Cannot geocode the given address')); }
    });
  }
};
