const { Address, GeoLocation, Forecast } = require('../../entities/index');

module.exports = (locationRepository, mapServices, forecastServices) => {
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

    const geoLocation = new GeoLocation(await mapServices.geocode(addressStr));
    const location = { ...{ address: newAddress }, coords: geoLocation };
    const newRecord = await locationRepository.add(location);
    return newRecord;
  };

  return {
    checkWeather: async (data) => {
      const address = new Address(data);
      let location = await locationRepository.getByAddress(address);
      if (!location) {
        location = await checkAddress(data);
      }
      const forecast = new Forecast({
        data: await forecastServices.getData(location.coords),
      });
      return locationRepository.update(location.id, { forecast });
    },
  };
};
