const auth = require('../../routes/auth');

const debug = require('debug')('OAuth2Service');

module.exports = (cachingServices) => {
  const {
    oAuth2: {
      server: oAuth2,
      Response,
      Request,
    },
  } = cachingServices;

  return {
    /**
    * Obtaine OAuth token with Basic Authentication
    */
    async obtainToken(req, res, next) {
      const request = new Request(req);
      const response = new Response(res);

      try {
        const token = await oAuth2.token(request, response);
        debug('obtainToken: token %s obtained successfully', token);
        res.json(token);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Authenticates a request.
     */
    async authenticateRequest(req, res, next) {
      const request = new Request(req);
      const response = new Response(res);

      try {
        const authData = await oAuth2.authenticate(request, response);
        debug('the request was successfully authenticated');
        req.auth = authData;
        next();
      } catch (err) {
        next(err);
      }
    },
  };
};
