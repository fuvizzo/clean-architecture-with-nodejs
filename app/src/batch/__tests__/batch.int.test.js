const faker = require('faker');

const Location = require('../../frameworks/persistence/mongo-db/models/location');
const service = require('..');
const dependencies = require('../../config/dependencies');

jest.mock('../../config/dependencies');
jest.setTimeout(60000);
const PRECIPITATION_TYPES = [
  'Thunderstorm',
  'Drizzle',
  'Rain',
  'Snow',
  'Clear',
  'Clouds',
];
const FAKE_LOCATION_MAX_NUMBER = 1000;
const randomMain = (max) => PRECIPITATION_TYPES[Math.floor(Math.random() * max)];

const createFakeLocations = () => {
  const items = [];
  for (let i = 0; i < FAKE_LOCATION_MAX_NUMBER; i += 1) {
    const item = {
      address: {
        street: faker.address.streetName(),
        streetNumber: Math.floor(1000 * Math.random()),
        town: faker.address.city(),
        postalCode: faker.address.zipCode(),
        country: faker.address.country(),
      },
      coords: {
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
      },
      forecast: {
        data: {
          weather: [{
            main: randomMain(6),
          }],
        },
      },
      queriedBy: faker.internet.email(),
      timeStamp: faker.time.recent(),
    };
    if (Math.random() <= 0.5) {
      item.notification = {
        causes: [randomMain(4), randomMain(4)],
      };
    }
    if (Math.random() <= 0.5) {
      const schedules = ['10:30;15:30', '16:00;18:00'];
      if (item.notification && item.notification.causes) {
        item.notification = {
          ...item.notification,
          schedules,
        };
      } else {
        item.notification = { schedules };
      }
    }
    items.push(item);
  }
  return items;
};

describe('Service integration tests', () => {
  beforeAll(async () => {
    await Location.deleteMany({});
  });

  beforeEach(async () => {
    await Location.insertMany(createFakeLocations());
  });

  afterEach(async () => {
    await Location.deleteMany({});
  });

  afterAll(async () => {
    await dependencies.databaseServices.closeDatabase();
  });

  describe('Check for precipitation changes for every address', () => {
    it('   ', async () => {
      await service();
    });
  });
});
