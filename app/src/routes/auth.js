const express = require('express');
const ExpressRedisCache = require('express-redis-cache');

const router = express.Router();

const asyncHandler = require('express-async-handler');

const OAuth2Service = require('../services/oauth');

const locationController = require('../controllers');

module.exports = (dependencies) => {
  const { cachingServices } = dependencies;
  const oAuth2Service = OAuth2Service(cachingServices);

  const cache = ExpressRedisCache({
    expire: Number(process.env.REDIS_CACHE_EXPIRATION_PERIOD),
    client: cachingServices.client,
  });

  router.all('/oauth/token', asyncHandler(async (req, res, next) => oAuth2Service.obtainToken(req, res, next)));

  router.use(oAuth2Service.authenticateRequest);

  router.get(
    '/weather',
    cache.route(),
    asyncHandler(
      async (req, res, next) => locationController(dependencies).checkWeather(req, res, next),
    ),
  );

  router.post(
    '/notification-options',
    asyncHandler(
      async (req, res, next) => locationController(dependencies)
        .setNotificationOptions(req, res, next),
    ),
  );

  return router;
};
