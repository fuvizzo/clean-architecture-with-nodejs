const Redis = require('ioredis');
const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('./models/oauth2');
const CachingServices = require('../../../contracts/caching-services');

const { Request, Response } = OAuth2Server;

module.exports = class RedisCachingServices extends CachingServices {
  async initDatabase() {
    const redisClient = new Redis(process.env.REDIS_URL);
    this.oAuth2 = {
      server: new OAuth2Server({
        model: new OAuth2Model(redisClient),
        accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
        scope: ['refresh_token', 'client_credentials', 'password'],
      }),
      Request,
      Response,
    };

    return redisClient;
  }
};
