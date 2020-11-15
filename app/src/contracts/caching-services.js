module.exports = class CachingServices {
  constructor() {
    this.client = null;
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }
};
