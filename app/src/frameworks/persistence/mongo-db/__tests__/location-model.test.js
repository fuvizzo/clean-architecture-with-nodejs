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
      /* const data = {
        first_name: 'Fulvio',
        last_name: 'Cusimano',
        email: 'fulvio.cusimano@foo.foo',
      };
      const newLocation = new Location(data);
      expect(newLocation.firstName).toEqual(data.firstName);
      expect(newLocation.lastName).toEqual(data.lastName);
      expect(newLocation.email).toEqual(data.email); */
    });
  });
});
