const request = require('supertest');
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
    describe('Check the weather for a given address', () => {
      const getAccessToken = async () => request(app).post('/auth/oauth/token')
        .set('Authorization', `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64')}`)
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send({
          grant_type: 'password',
          username: 'test-user',
          password: 'password',
          scope: 'email basic_user_info',
        });

      it('should return a 200 response if the request is authorized and the address is valid', async () => {
        const oauthTokenResponse = await getAccessToken();
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
        const oauthTokenResponse = await getAccessToken();
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
  });
});
