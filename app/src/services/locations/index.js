const { Address, GeoLocation, Forecast } = require('../../entities/index');

module.exports = (locationRepository, mapServices) => {
  const checkAddress = async (data) => {
    const {
      street,
      streetNumber,
      town,
      postalCode,
      country,
    } = data;
    const newAddress = new Address(data);

    const addressStr = `${street} ${streetNumber}, ${town}, ${postalCode}, ${country}`;

    const newGeoLocation = new GeoLocation(await mapServices.geocode(addressStr));
    const newLocation = { ...{ address: newAddress }, coords: newGeoLocation };
    const newRecord = await locationRepository.add(newLocation);
    return newRecord;
  };

  return {
    checkAddress,
    checkWeather: async (data) => {
      const address = new Address(data);
      let location = await locationRepository.getByAddress(address);
      if (!location) {
        location = await checkAddress(data);
      }

      return null;
    },
  };
};
