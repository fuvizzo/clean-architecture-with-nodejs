const { pipeline, Readable } = require('stream');
const moment = require('moment');
const pipe = require('pipeline-pipe');
const dependencies = require('../config/dependencies');

const PRECIPITATION_TYPES = [
  'Thunderstorm',
  'Drizzle',
  'Rain',
  'Snow',
];

const sendEmail = (email) => {
  console.log(`Sending email to ${email}`);
};

const checkweather = async (forecastServices, location) => {
  try {
    const response = await forecastServices.getData(location.coords);
    const { data, status } = response;
    if (status === 200) {
      const {
        weather: [{
          main,
        }],
        dt,
      } = data;
      const dateTime = moment(moment(dt * 1000).format('HH:mm'), 'hh:mm');
      if (PRECIPITATION_TYPES.some((type) => type === main)) {
        if (location.notification.causes.length === 0
          && location.notification.schedules.lenght === 0) {
          sendEmail(location.queriedBy);
        } else if (location.notification.causes.some((type) => type === main)) {
          if (location.notification.schedules.lenght === 0) {
            sendEmail(location.queriedBy);
          } else if (location.notification.schedules.reduce((acc, val) => {
            const rangeEnds = val.split(';');
            const startTime = moment(rangeEnds[0], 'hh:mm');
            const endTime = moment(rangeEnds[1], 'hh:mm');
            if (startTime.isBefore(dateTime) && dateTime.isBefore(endTime)) {
              ++acc;
            }
            return acc;
          }, 0) > 0) {
            sendEmail(location.queriedBy);
          }
        }
      }
      return location;
    }
    throw new Error('Something went wrong');
  } catch (err) {
    console.log(err);
  }
};

module.exports = async () => {
  const {
    databaseServices:
    {
      locationRepository,
    },
    forecastServices,
  } = dependencies;

  await pipeline(
    Readable.from(locationRepository.getAll().lean()),
    pipe((data) => checkweather(forecastServices, data)),
    // pipe(update),
    (err) => console.log(err || 'Process comlpleted'),
  );
};
