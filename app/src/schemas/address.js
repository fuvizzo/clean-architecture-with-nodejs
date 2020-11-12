const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const FieldProps = {
  Id: { LABEL: 'Address ID' },
  Street: { LABEL: 'Street' },
  StreetNumber: { LABEL: 'StreetNumber' },
  Town: { LABEL: 'Town' },
  PostalCode: { LABEL: 'PostalCode' },
  Country: { LABEL: 'Country' },
};

const address = {
  street: Joi.string().required().label(FieldProps.Street.LABEL),
  streetNumber: Joi.string().required().label(FieldProps.StreetNumber.LABEL),
  town: Joi.string().required().label(FieldProps.Town.LABEL),
  postalCode: Joi.string().required().label(FieldProps.PostalCode.LABEL),
  country: Joi.string().required().label(FieldProps.Country.LABEL),
};

module.exports = {
  address: Joi.object({
    id: Joi.objectId().alphanum().required().label(FieldProps.Id.LABEL),
    ...address,
  }),
  newAddress: Joi.object(address),
};
