const request = require('supertest');
const faker = require('faker');
const Location = require('../../frameworks/persistence/mongo-db/models/location');
const app = require('..');

jest.mock('../../config/dependencies');

const dependencies = require('../../config/dependencies');

describe('App integration tests', () => {
  beforeAll(async () => {
    await Location.deleteMany({});
  });

  afterEach(async () => {
    await Location.deleteMany({});
  });

  afterAll(async () => {
    await dependencies.databaseServices.closeDatabase();
  });

  describe('Location endpoints', () => {
    const getAccessToken = async (username) => request(app).post('/auth/oauth/token')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64')}`)
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'password',
        username,
        password: 'password',
        scope: 'email basic_user_info',
      });

    describe('Check the weather for a given address', () => {
      it('should return a 200 response if the request is authorized and the address is valid', async () => {
        const oauthTokenResponse = await getAccessToken('test-user-1');
        expect(oauthTokenResponse.statusCode).toEqual(200);
        expect(oauthTokenResponse.body).toHaveProperty('accessToken');

        const res = await request(app).get('/auth/weather')
          .set('Authorization', `Bearer ${oauthTokenResponse.body.accessToken}`)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .query({
            street: 'Calle Marina',
            streetNumber: '187',
            town: 'Barcelona',
            postalCode: '08013',
            country: 'Spain',
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.coords.lat).toEqual(41.3999924);
        expect(res.body.coords.lng).toEqual(2.1795);
        expect(res.body.forecast).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              weather: expect.arrayContaining([
                expect.objectContaining({
                  description: 'clear sky',
                }),
              ]),
            }),
          }),
        );
      });

      it('should return a 400 response for an authorized request with some missing querystring params', async () => {
        const oauthTokenResponse = await getAccessToken('test-user-1');
        expect(oauthTokenResponse.statusCode).toEqual(200);
        expect(oauthTokenResponse.body).toHaveProperty('accessToken');
        const res = await request(app).get('/auth/weather')
          .set('Authorization', `Bearer ${oauthTokenResponse.body.accessToken}`)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .query({
            street: 'Calle Marina',
            foo: '187',
            town: 'Barcelona',
            postalCode: '08013',
            country: 'Spain',
          });
        expect(res.statusCode).toEqual(400);
      });

      it('should return a 401 response for an unauthorized request', async () => {
        const res = await request(app).get('/auth/weather')
          .set('Content-type', 'application/x-www-form-urlencoded')
          .query({
            street: 'Calle Marina',
            streetNumber: '187',
            town: 'Barcelona',
            postalCode: '08013',
            country: 'Spain',
          });
        expect(res.statusCode).toEqual(401);
      });

      it('should return a 401 response for an unauthorized request due to an expired token', async () => {
        const res = await request(app).get('/auth/weather')
          .set('Authorization', 'Bearer 19d07c855178bd8622efacc4dfb4b633ac87f051')
          .set('Content-type', 'application/x-www-form-urlencoded')
          .query({
            street: 'Calle Marina',
            streetNumber: '187',
            town: 'Barcelona',
            postalCode: '08013',
            country: 'Spain',
          });
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('Set notification options', () => {
      it('should return a 204 response if the request is authorized, the params are correct and the location is in the db', async () => {
        const location = {
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
                main: 'Clear',
              }],
            },
          },
          queriedBy: 'test-user-1@foo.foo',
          timeStamp: faker.time.recent(),
        };
        await Location.create(location);

        const oauthTokenResponse = await getAccessToken('test-user-1');
        expect(oauthTokenResponse.statusCode).toEqual(200);
        expect(oauthTokenResponse.body).toHaveProperty('accessToken');

        const res = await request(app).post('/auth/notification-options')
          .set('Authorization', `Bearer ${oauthTokenResponse.body.accessToken}`)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .send({
            causes: ['Rain', 'Snow'],
            schedules: ['10:30;15:30'],
          });
        expect(res.statusCode).toEqual(204);
      });

      it('should return a 400 response if the request is authorized but the params are missing/wrong', async () => {
        const oauthTokenResponse = await getAccessToken('test-user-1');
        expect(oauthTokenResponse.statusCode).toEqual(200);
        expect(oauthTokenResponse.body).toHaveProperty('accessToken');

        const res = await request(app).post('/auth/notification-options')
          .set('Authorization', `Bearer ${oauthTokenResponse.body.accessToken}`)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .send({
            causes: 'foo',
            schedules: 123,
          });
        expect(res.statusCode).toEqual(400);
      });

      it('should return a 404 response if the request is authorized, the params are correct but the location is not in the db', async () => {
        const oauthTokenResponse = await getAccessToken('test-user-2');
        expect(oauthTokenResponse.statusCode).toEqual(200);
        expect(oauthTokenResponse.body).toHaveProperty('accessToken');

        const res = await request(app).post('/auth/notification-options')
          .set('Authorization', `Bearer ${oauthTokenResponse.body.accessToken}`)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .send({
            causes: 'foo',
            schedules: 123,
          });
        expect(res.statusCode).toEqual(400);
      });
    });
  });
});
