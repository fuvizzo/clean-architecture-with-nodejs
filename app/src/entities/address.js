module.exports = class Address {
  constructor({
    street,
    streetNumber,
    town,
    postalCode,
    country,
  }) {
    this.street = street;
    this.streetNumber = streetNumber;
    this.town = town;
    this.postalCode = postalCode;
    this.country = country;
  }
};
