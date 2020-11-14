const GoogleMapServices = require('../../../contracts/maps-services');

module.exports = class InMemoryGoogleMapServices extends GoogleMapServices {
  static geocode(addressStr) {
    return new Promise((resolve, reject) => {
      if (addressStr.includes('Calle Marina')) {
        resolve({});
      } else { reject(new Error('Cannot geocode the given address')); }
    });
  }
};
