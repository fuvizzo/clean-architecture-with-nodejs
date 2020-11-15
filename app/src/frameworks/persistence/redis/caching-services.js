const Redis = require('ioredis');
const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('./models/oauth2');
const CachingServices = require('../../../contracts/caching-services');

const { Request, Response } = OAuth2Server;

module.exports = class RedisCachingServices extends CachingServices {
  constructor() {
    super();
    this.oAuth2 = null;
  }

  async initDatabase() {
    this.client = new Redis(process.env.REDIS_URL);
    this.oAuth2 = {
      server: new OAuth2Server({
        model: new OAuth2Model(this.client),
        accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
        scope: ['email', 'basic_user_info'],
      }),
      Request,
      Response,
    };
  }
};
