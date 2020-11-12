module.exports = class ForecastServices {
  getForecast(type, lat, lng) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }
};
