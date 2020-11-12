const express = require('express');

const router = express.Router();

const asyncHandler = require('express-async-handler');

const OAuth2Service = require('../services/oauth');

const locationController = require('../controllers');

module.exports = (dependencies) => {
  const { cachingServices } = dependencies.cachingServices;
  const oAuth2Service = OAuth2Service(cachingServices);

  router.all('/oauth/token', asyncHandler(async (req, res, next) => oAuth2Service.obtainToken(req, res, next)));

  router.use(oAuth2Service.authenticateRequest);

  router.post(
    '/address',
    asyncHandler(
      async (req, res, next) => locationController(dependencies).checkAddress(req, res, next),
    ),
  );

  router.get('/', asyncHandler(
    async (req, res) => {
      res.send('Congratulations, you are in the authorized area!');
    },
  ));

  return router;
};
