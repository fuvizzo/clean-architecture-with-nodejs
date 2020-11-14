const sinon = require('sinon');
const LocationService = require('..');

const LocationRepository = require('../../../contracts/repositories/location');
const MapServices = require('../../../contracts/maps-services');

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

      sinon
        .stub(LocationRepository.prototype, 'add')
        .callsFake((locationInstance) => {
          street = locationInstance.street;
          streetNumber = locationInstance.streetNumber;
          town = locationInstance.town;
          postalCode = locationInstance.postalCode;
          country = locationInstance.country;

          id = 'xpz123';
          return { ...locationInstance, id };
        });

      sinon
        .stub(MapServices.prototype, 'geocode')
        .callsFake((addressInstance) => { });

      const locationService = LocationService(
        new LocationRepository(),
        new MapServices(),
      );
      locationService.checkAddress(
        'Calle Marina',
        '187',
        'Barcelona',
        '08013',
        'Spain',
      );
      sinon.assert.calledOnce(LocationRepository.prototype.add);
      sinon.assert.calledOnce(MapServices.prototype.notify);
      expect(id).toEqual('xpz123');
      expect(street).toEqual('Calle Marina');
      expect(streetNumber).toEqual('187');
      expect(town).toEqual('Barcelona');
      expect(postalCode).toEqual('08013');
      expect(country).toEqual('Spain');
    });
  });
});
