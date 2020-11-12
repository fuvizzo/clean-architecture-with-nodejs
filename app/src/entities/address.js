module.exports = class Address {
  constructor({
    id = null, street, streetNumber, town, postalCode, country,
  }) {
    this.id = id;
    this.street = street;
    this.streetNumber = streetNumber;
    this.town = town;
    this.postalCode = postalCode;
    this.country = country;
  }
};
