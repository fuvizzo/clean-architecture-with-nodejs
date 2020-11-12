module.exports = class CachingServices {
  constructor() {
    this.locationRepository = null;
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'));
    });
  }
};
