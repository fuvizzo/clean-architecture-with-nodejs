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
      if (lat === 41.3999924 && lng === 2.1795) {
        resolve({
          data: {
            coord: {
              lon: 2.18,
              lat: 41.4,
            },
            weather: [
              {
                id: 800,
                main: 'Clear',
                description: 'clear sky',
                icon: '01n',
              },
            ],
            base: 'stations',
            main: {
              temp: 291.52,
              feels_like: 290,
              temp_min: 290.37,
              temp_max: 292.59,
              pressure: 1017,
              humidity: 77,
            },
            visibility: 10000,
            wind: {
              speed: 4.1,
              deg: 240,
            },
            clouds: {
              all: 0,
            },
            dt: 1605461673,
            sys: {
              type: 1,
              id: 6398,
              country: 'ES',
              sunrise: 1605422412,
              sunset: 1605457915,
            },
            timezone: 3600,
            id: 3124932,
            name: 'el Clot',
            cod: 200,
          },
          type: 'current-weather',
        });
      } else if (lat && lng) {
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
