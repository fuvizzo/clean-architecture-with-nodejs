const LocationService = require('../services/locations');
const AppError = require('../error/app-error');
const { newAddress: newAddressSchema } = require('../schemas/index');

module.exports = (dependencies) => {
  const { locationRepository } = dependencies.databaseServices;
  const { mapServices } = dependencies;
  const locationService = LocationService(locationRepository, mapServices);
  return {
    checkAddress: async (req, res, next) => {
      const { error } = newAddressSchema.validate(req.body);
      if (error) {
        next(new AppError(error.message, 400));
      } else {
        try {
          const response = await locationService.checkAddress(req.body);
          res.status(201);
          res.json({ id: response.id });
          res.end();
        } catch (err) {
          next(err);
        }
      }
    },

    checkWeather: async (req, res, next) => {
      const { error } = newAddressSchema.validate(req.body);
      if (error) {
        next(new AppError(error.message, 400));
      } else {
        try {
          const response = await locationService.checkWeather(req.body);
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
