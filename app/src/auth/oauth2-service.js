const debug = require('debug')('OAuth2Service');

const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('../frameworks/persistence/redis/models/oauth2.js');

const { Request, Response } = OAuth2Server;

/**
 * Instantiates OAuth2Server using the supplied model.
 */
const oAuth2 = new OAuth2Server({
  model: new OAuth2Model(),
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
  scope: ['refresh_token', 'client_credentials', 'password'],
});
/**
 * Creating constructor
 */
class OAuth2Service {
  /**
   * Obtaine OAuth token with Basic Authentication
   */
  static async obtainToken(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);

    try {
      const token = await oAuth2.token(request, response);
      debug('obtainToken: token %s obtained successfully', token);
      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Authenticates a request.
   */
  static async authenticateRequest(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);

    try {
      await oAuth2.authenticate(request, response);
      debug('the request was successfully authenticated');
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OAuth2Service;
