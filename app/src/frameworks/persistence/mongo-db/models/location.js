const mongoose = require('mongoose');

/**
 * Location model schema.
 */

const coordsSchema = {
  lng: { type: Number, required: true },
  lat: { type: Number, required: true },
};

const locationSchema = new mongoose.Schema({
  address: {
    street: { type: String, required: true },
    streetNumber: { type: String, required: true },
    town: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  coords: {
    type: coordsSchema,
  },
  forecast: { type: Object },
});

module.exports = mongoose.model('Location', locationSchema);
