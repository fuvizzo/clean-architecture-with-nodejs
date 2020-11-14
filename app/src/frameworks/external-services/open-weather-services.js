const axios = require('axios');
const ForecastServices = require('../../contracts/forecast-services');

module.exports = class OpenWeatherServices extends ForecastServices {
  static async getData({ lat, lng }) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  }
};
