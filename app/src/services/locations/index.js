const { Address } = require('../../entities/index');

module.exports = (locationRepository, googleMapServices) => ({
  checkAddress: async (street, streetNumber, town, postalCode, country) => {
    const newAddress = new Address({
      street,
      streetNumber,
      town,
      postalCode,
      country,
    });

    const newGeoLocation = googleMapServices.geocode(newAddress);

    const newLocation = { address: newAddress, ...{ coords: newGeoLocation } };
    const newRecord = locationRepository.add(newLocation);

    return newRecord;
  },
});
