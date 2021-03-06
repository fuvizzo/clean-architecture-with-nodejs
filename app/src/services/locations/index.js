const { Address, GeoLocation, Forecast } = require('../../entities/index');

module.exports = (locationRepository, mapServices, forecastServices) => {
  const checkAddress = async (data) => {
    const {
      street,
      streetNumber,
      town,
      postalCode,
      country,
    } = data.address;

    const newAddress = new Address(data.address);

    const addressStr = `${street} ${streetNumber}, ${town}, ${postalCode}, ${country}`;

    const geoLocation = new GeoLocation(await mapServices.geocode(addressStr));
    const location = {
      queriedBy: data.user.email,
      ...{ address: newAddress },
      coords: geoLocation,
    };
    const newRecord = await locationRepository.add(location);
    return newRecord;
  };

  return {
    checkWeather: async (data) => {
      const address = new Address(data.address);
      let location = await locationRepository.getByAddress(address);
      if (!location) {
        location = await checkAddress(data);
      }
      const forecast = new Forecast(await forecastServices.getData(location.coords));
      return locationRepository.update(location.id, { forecast });
    },

    setNotificationOptions: async (data) => {
      const location = await locationRepository.getByEmail(data.user.email);
      if (location) {
        await locationRepository.update(location.id, { notification: data.notification });
        return true;
      }
      return false;
    },
  };
};
