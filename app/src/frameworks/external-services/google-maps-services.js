const { Client } = require('@googlemaps/google-maps-services-js');

const MapServices = require('../../contracts/maps-services');
const AppError = require('../../error/app-error');

const googleMapClient = new Client();

module.exports = class GoogleMapServices extends MapServices {
  static async geocode(addressStr) {
    const { data, status } = await googleMapClient.geocode({
      params: {
        address: addressStr,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    if (status === 200) {
      if (data.status !== 'OK') {
        throw new AppError(data.status);
      }
      return data.results[0].geometry.location;
    }
    throw new AppError('Something went wrong');
  }
};
