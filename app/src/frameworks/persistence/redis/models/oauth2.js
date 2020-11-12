const debug = require('debug')('OAuth2Model');

const fmt = require('util').format;
const OAuth2Model = require('../../../../contracts/oauth/model');

const formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
  grantTypes: 'clients:%s:grant_types',
};

class RedisOAuth2Model extends OAuth2Model {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  /**
  * Get access token.
  */
  async getAccessToken(bearerToken) {
    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));
    if (!token || token.accessToken !== bearerToken) {
      return {};
    }
    debug('getAccessToken: sent access token successfully');
    return {
      accessToken: new Date(token.accessToken),
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: {
        id: token.clientId,
      },
      user: {
        id: token.userId,
      },

    };
  }

  /**
  * Get client.
  */
  async getClient(clientId, clientSecret) {
    const client = await this.redisClient.hgetall(fmt(formats.client, clientId));
    const grants = await this.redisClient.smembers(fmt(formats.grantTypes, clientId));

    if (!client || client.clientSecret !== clientSecret) {
      return {};
    }
    debug('Sent client details successfully');
    return {
      clientId: client.clientId,
      grants,
    };
  }

  /**
   * Get refresh token.
   */
  async getRefreshToken(bearerToken) {
    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));

    if (!token || token.accessToken !== bearerToken) {
      return {};
    }

    return {
      clientId: token.clientId,
      expires: token.refreshTokenExpiresOn,
      refreshToken: token.accessToken,
      user: {
        id: token.userId,
      },
    };
  }

  /**
  * Get user.
  */
  async getUser(username, password) {
    const user = await this.redisClient.hgetall(fmt(formats.user, username));

    if (!user || password !== user.password) {
      return {};
    }
    debug('getUser: user details sent succesfully!!');
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      grants: ['password', 'refresh_token'],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  verifyScope(token, scope) {
    if (!token.scope) {
      return false;
    }
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
  }

  /**
  * Save token.
  */
  async saveToken(token, client, user) {
    const pipe = this.redisClient.pipeline();
    const enhancedToken = {
      ...token, ...{ userId: user.id, clientId: client.clientId },
    };

    const data = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      client: {
        id: client.clientId,
      },
      user: {
        id: user.id,
      },
    };
    await pipe
      .hmset(fmt(formats.token, token.accessToken), enhancedToken)
      .hmset(fmt(formats.token, token.refreshToken), enhancedToken)
      .exec()
      .then(() => {
        debug('saveToken: token %s saved successfully', enhancedToken);
      });
    return data;
  }
}

module.exports = RedisOAuth2Model;
