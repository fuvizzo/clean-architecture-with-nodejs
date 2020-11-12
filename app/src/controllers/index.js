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
          const {
            street,
            streetNumber,
            town, postalCode,
            country,
          } = req.body;

          const response = await locationService.checkAddress(
            street,
            streetNumber,
            town,
            postalCode,
            country,
          );
          res.status(201);
          res.json({ id: response.id });
          res.end();
        } catch (err) {
          next(err);
        }
      }
    },
  };
};
