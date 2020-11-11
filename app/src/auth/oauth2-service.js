const debug = require('debug')('OAuth2Service');

const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('../models/oauth2.js').getInstance();

const { Request, Response } = OAuth2Server;

/**
 * Instantiates OAuth2Server using the supplied model.
 */
const oAuth2 = new OAuth2Server({
  model: OAuth2Model,
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
  allowBearerTokensInQueryString: true,
});
/**
 * Creating constructor
 */
class OAuth2Service {
  /**
   * Obtaine OAuth token with Basic Authentication
   */
  static async obtainToken(req, res) {
    const request = new Request(req);
    const response = new Response(res);

    try {
      const token = await oAuth2.token(request, response);
      debug('obtainToken: token %s obtained successfully', token);
      res.json(token);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  /**
   * Authenticates a request.
   */
  static async authenticateRequest(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);

    try {
      oAuth2.authenticate(request, response);
      debug('the request was successfully authenticated');
      next();
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }
}

module.exports = OAuth2Service;
