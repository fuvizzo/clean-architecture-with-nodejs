const express = require('express');

const router = express.Router();

const asyncHandler = require('express-async-handler');

const OAuth2Service = require('../auth/oauth2-service');

/* const studentController = require('../controllers/students'); */

router.all('/oauth/token', asyncHandler(async (req, res, next) => OAuth2Service.obtainToken(req, res, next)));

router.use(OAuth2Service.authenticateRequest);

module.exports = (dependencies) => {
  /* router.post(
    '/',
    asyncHandler(
      async (req, res, next) => null,
    ),
  ); */

  router.get('/', asyncHandler(
    async (req, res) => {
      res.send('Congratulations, you are in the authorized area!');
    },
  ));

  return router;
};
