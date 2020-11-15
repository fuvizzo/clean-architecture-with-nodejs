const ForecastServices = require('../../../contracts/forecast-services');

module.exports = class MockedOpenWeatherServices extends ForecastServices {
  static getData(type, lat, lng) {
    return new Promise((resolve, reject) => {
      if (type === 'current' && lat === '' && lng === '') {
        resolve({});
      } else {
        reject(new Error('Cannot retrieve the current forecast for the given address'));
      }
    });
  }
};
