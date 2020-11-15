const mongoose = require('mongoose');

/**
 * Location model schema.
 */
const locationSchema = new mongoose.Schema({
  address: {
    street: { type: String, required: true },
    streetNumber: { type: String, required: true },
    town: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  coords: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  forecast: { type: Object },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', locationSchema);
