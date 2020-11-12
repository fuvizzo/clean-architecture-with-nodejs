class OAuth2Model {
  /**
  * Get access token.
  */
  getAccessToken(bearerToken) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }

  /**
  * Get client.
  */
  getClient(clientId, clientSecret) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }

  /**
   * Get refresh token.
   */
  getRefreshToken(bearerToken) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }

  /**
  * Get user.
  */
  getUser(username, password) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }

  /**
  * Save token.
  */
  saveToken(token, client, user) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }
}

module.exports = OAuth2Model;
