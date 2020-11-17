const LocationService = require('../services/locations');
const AppError = require('../error/app-error');
const {
  newAddress: newAddressSchema,
  notificationOptions: notificationOptionsSchema,
} = require('../schemas/index');

module.exports = (dependencies) => {
  const { locationRepository } = dependencies.databaseServices;
  const { mapServices, forecastServices } = dependencies;
  const locationService = LocationService(locationRepository, mapServices, forecastServices);
  return {
    setNotificationOptions: async (req, res, next) => {
      const { error } = notificationOptionsSchema.validate(req.body);
      if (error) {
        next(new AppError(error.message, 400));
      } else {
        try {
          await locationService.setNotificationOptions({
            notification: req.body,
            user: req.auth.user,
          });
          res.status(204);
          res.end();
        } catch (err) {
          next(err);
        }
      }
    },

    checkWeather: async (req, res, next) => {
      const { error } = newAddressSchema.validate(req.query);
      if (error) {
        next(new AppError(error.message, 400));
      } else {
        try {
          const response = await locationService.checkWeather({
            address: req.query,
            user: req.auth.user,
          });
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
