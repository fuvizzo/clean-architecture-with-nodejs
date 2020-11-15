const MapServices = require('../../../contracts/maps-services');

module.exports = class MockedGoogleMapServices extends MapServices {
  static geocode(addressStr) {
    return new Promise((resolve, reject) => {
      if (addressStr.includes('Calle Marina')) {
        resolve({
          lat: 41.3999924,
          lng: 2.1795,
        });
      } else { reject(new Error('Cannot geocode the given address')); }
    });
  }
};
