const InMemoryMongoDbDatabaseServices = require('../in-memory/database-services');
const Location = require('../models/location');

const databaseServices = new InMemoryMongoDbDatabaseServices();
describe('Location model tests', () => {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  beforeAll(async () => {
    await databaseServices.initDatabase();
    await Location.deleteMany({});
  });

  afterEach(async () => {
    await Location.deleteMany({});
  });

  afterAll(async () => {
    await databaseServices.closeDatabase();
  });

  it('Has a module', () => {
    expect(Location).toBeDefined();
  });

  describe('Create a new Location', () => {
    it('saves a new Location in the db', async () => {
      const data = {
        address: {
          street: 'Calle Marina',
          streetNumber: '187',
          town: 'Barcelona',
          postalCode: '08013',
          country: 'Spain',
        },
        coords: {
          lat: 41.3999924,
          lng: 2.1795,
        },

      };
      const newLocation = await Location.findOneAndUpdate({
        address: data.address,
      }, data, {
        new: true,
        upsert: true,
      });

      expect(newLocation.address.street).toEqual(data.address.street);
      expect(newLocation.address.streetNumber).toEqual(data.address.streetNumber);
      expect(newLocation.address.postalCode).toEqual(data.address.postalCode);
      expect(newLocation.address.country).toEqual(data.address.country);
      expect(newLocation.coords.lat).toEqual(data.coords.lat);
      expect(newLocation.coords.lng).toEqual(data.coords.lng);
    });
  });
});
