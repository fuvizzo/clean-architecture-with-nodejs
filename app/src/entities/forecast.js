module.exports = class Forecast {
  constructor({
    data,
    type = 'current-weather',
  }) {
    this.data = data;
    this.type = type;
  }
};
