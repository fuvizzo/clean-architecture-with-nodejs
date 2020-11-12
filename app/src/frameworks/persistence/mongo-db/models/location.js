const mongoose = require('mongoose');

/**
 * Location model schema.
 */
const locationSchema = new mongoose.Schema({
  street: { type: String, required: true },
  streetNumber: { type: String, required: true },
  town: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  coords: {
    lng: { type: String, required: true },
    lat: { type: String, required: true },
  },
  forecast: { type: Object },
});

module.exports = mongoose.model('Location', locationSchema);
