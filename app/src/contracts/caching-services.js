module.exports = class CachingServices {
  constructor() {
    this.oAuth2 = null;
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }
};
