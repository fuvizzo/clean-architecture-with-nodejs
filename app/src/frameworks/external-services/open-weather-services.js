const ForecastServices = require('../../contracts/forecast-services');

module.exports = class OpenWeatherServices extends ForecastServices {
  getForecast(type, lat, lng) {
    return null;
  }
};