const sinon = require('sinon');
const LocationService = require('..');

const LocationRepository = require('../../../contracts/repositories/location');
const MapServices = require('../../../contracts/maps-services');
const MockedGoogleMapServices = require('../../../frameworks/external-services/mocks/google-maps-services');

describe('Location service unit tests', () => {
  it('Has a module', () => {
    expect(LocationService).toBeDefined();
  });

  describe('check address', () => {
    it('executes checkAddress command', async () => {
      let id;
      let street;
      let streetNumber;
      let town;
      let postalCode;
      let country;
      let lat;
      let lng;

      sinon
        .stub(LocationRepository.prototype, 'add')
        .callsFake((locationInstance) => {
          street = locationInstance.address.street;
          streetNumber = locationInstance.address.streetNumber;
          town = locationInstance.address.town;
          postalCode = locationInstance.address.postalCode;
          country = locationInstance.address.country;

          id = 'xpz123';
          return { ...locationInstance, id };
        });

      sinon
        .stub(MapServices.prototype, 'geocode')
        .callsFake(async () => {
          const data = await MockedGoogleMapServices.geocode('Calle Marina 187, Barcelona, 08013, Spain');
          lat = data.lat;
          lng = data.lng;
          return data;
        });

      const locationService = LocationService(
        new LocationRepository(),
        new MapServices(),
      );

      await locationService.checkAddress({
        street: 'Calle Marina',
        streetNumber: '187',
        town: 'Barcelona',
        postalCode: '08013',
        country: 'Spain',
      });
      sinon.assert.calledOnce(LocationRepository.prototype.add);
      sinon.assert.calledOnce(MapServices.prototype.geocode);
      expect(id).toEqual('xpz123');
      expect(street).toEqual('Calle Marina');
      expect(streetNumber).toEqual('187');
      expect(town).toEqual('Barcelona');
      expect(postalCode).toEqual('08013');
      expect(country).toEqual('Spain');
      expect(lat).toEqual(41.3999924);
      expect(lng).toEqual(2.1795);
    });
  });
});
