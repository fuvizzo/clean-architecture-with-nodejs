const LocationService = require('../services/locations');
const AppError = require('../error/app-error');
const { newAddress: newAddressSchema } = require('../schemas/index');

module.exports = (dependencies) => {
  const { locationRepository } = dependencies.databaseServices;
  const { mapServices, forecastServices } = dependencies;
  const locationService = LocationService(locationRepository, mapServices, forecastServices);
  return {
    checkWeather: async (req, res, next) => {
      const { error } = newAddressSchema.validate(req.query);
      if (error) {
        next(new AppError(error.message, 400));
      } else {
        try {
          const response = await locationService.checkWeather(req.query);
          res.status(200);
          res.json(response);
          res.end();
        } catch (err) {
          next(err);
        }
      }
    },
  };
};
