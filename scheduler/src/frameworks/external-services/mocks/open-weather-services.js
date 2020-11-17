const ForecastServices = require('../../../contracts/forecast-services');

const PRECIPITATION_TYPES = [
  'Thunderstorm',
  'Drizzle',
  'Rain',
  'Snow',
  'Clear',
  'Clouds',
];
const randomMain = (max) => PRECIPITATION_TYPES[Math.floor(Math.random() * max)];

const dt1 = '1605871800'; // 20/11/2020 11:30:00
const dt2 = '1605900600'; // 20/11/2020 19:30:00
module.exports = class MockedOpenWeatherServices extends ForecastServices {
  static getData({ lat, lng }) {
    return new Promise((resolve, reject) => {
      if (lat && lng) {
        resolve({
          status: 200,
          data: {

            dt: Math.random() <= 0.5 ? dt1 : dt2,
            weather: [
              {
                main: randomMain(6),
              },
            ],
          },
        });
      } else {
        reject(new Error('Cannot retrieve the current forecast for the given address'));
      }
    });
  }
};
