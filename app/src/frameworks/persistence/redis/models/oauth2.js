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
      return null;
    }
    debug('getAccessToken: sent access token successfully');
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      client: {
        id: token.clientId,
      },
      user: JSON.parse(token.user),
    };
  }

  /**
  * Get client.
  */
  async getClient(clientId, clientSecret) {
    const client = await this.redisClient.hgetall(fmt(formats.client, clientId));
    const grants = await this.redisClient.smembers(fmt(formats.grantTypes, clientId));

    if (!client || client.clientSecret !== clientSecret) {
      return null;
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
      return null;
    }

    return {
      clientId: token.clientId,
      expires: token.refreshTokenExpiresOn,
      refreshToken: token.accessToken,
      user: JSON.parse(token.user),
    };
  }

  /**
  * Get user.
  */
  async getUser(username, password) {
    const user = await this.redisClient.hgetall(fmt(formats.user, username));

    if (!user || password !== user.password) {
      return null;
    }
    debug('getUser: user details sent succesfully!!');
    return {
      basic_user_info: {
        username: user.username,
      },
      email: user.email,
      grants: ['password', 'refresh_token'],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  verifyScope(token, authorizedScopes) {
    if (!token.scope) {
      return false;
    }
    const requestedScopes = token.scope.split(' ');
    return requestedScopes.every((requested) => authorizedScopes.some(
      (authorized) => requested === authorized,
    ));
  }

  /**
  * Save token.
  */
  async saveToken(token, client, user) {
    const pipe = this.redisClient.pipeline();
    const scopedUserInfo = token.scope.split(' ').reduce((acc, val) => {
      // eslint-disable-next-line security/detect-object-injection
      acc[val] = user[val];
      return acc;
    }, {});

    const data = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      client: {
        id: client.clientId,
      },
      user: scopedUserInfo,
    };

    const enhancedToken = {
      ...token, ...{ user: JSON.stringify(scopedUserInfo), clientId: client.clientId },
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
