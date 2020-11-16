const sinon = require('sinon');
const LocationService = require('..');

const LocationRepository = require('../../../contracts/repositories/location');
const MapServices = require('../../../contracts/maps-services');
const ForecastServices = require('../../../contracts/forecast-services');
const MockedGoogleMapServices = require('../../../frameworks/external-services/mocks/google-maps-services');
const MockedOpenWeatherServices = require('../../../frameworks/external-services/mocks/open-weather-services');

describe('Location service unit tests', () => {
  it('Has a module', () => {
    expect(LocationService).toBeDefined();
  });

  describe('check weather', () => {
    describe('executes checkWeather command', () => {
      it('when the address is not yet stored in mongodb', async () => {
        let location = {};

        sinon
          .stub(LocationRepository.prototype, 'add')
          .callsFake((locationInstance) => {
            location = { ...locationInstance };
            location.id = 'xpz123';
            return { ...locationInstance, id: location.id };
          });

        sinon
          .stub(LocationRepository.prototype, 'getByAddress')
          .callsFake(() => null);

        sinon
          .stub(MapServices.prototype, 'geocode')
          .callsFake(async (addressStr) => {
            location.coords = await MockedGoogleMapServices.geocode(addressStr);
            return location.coords;
          });

        sinon
          .stub(ForecastServices.prototype, 'getData')
          .callsFake(async ({ lat, lng }) => MockedOpenWeatherServices.getData({
            lat,
            lng,
          }));

        sinon
          .stub(LocationRepository.prototype, 'update')
          .callsFake((locationId, { forecast }) => {
            location.forecast = forecast;
            return location;
          });

        const locationService = LocationService(
          new LocationRepository(),
          new MapServices(),
          new ForecastServices(),
        );

        await locationService.checkWeather({
          address: {
            street: 'Calle Marina',
            streetNumber: '187',
            town: 'Barcelona',
            postalCode: '08013',
            country: 'Spain',
          },
          user: {
            email: 'foo@foo',
          },
        });

        sinon.assert.calledOnce(LocationRepository.prototype.add);
        sinon.assert.calledOnce(LocationRepository.prototype.update);
        sinon.assert.calledOnce(MapServices.prototype.geocode);
        sinon.assert.calledOnce(ForecastServices.prototype.getData);

        expect(location.queriedBy).toEqual('foo@foo');
        expect(location.id).toEqual('xpz123');
        expect(location.address.street).toEqual('Calle Marina');
        expect(location.address.streetNumber).toEqual('187');
        expect(location.address.town).toEqual('Barcelona');
        expect(location.address.postalCode).toEqual('08013');
        expect(location.address.country).toEqual('Spain');
        expect(location.coords.lat).toEqual(41.3999924);
        expect(location.coords.lng).toEqual(2.1795);
        expect(location.forecast).toEqual(
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
    });
  });
});
