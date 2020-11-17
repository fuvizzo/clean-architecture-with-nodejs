const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const FieldProps = {
  Causes: { LABEL: 'Causes' },
  Schedules: { LABEL: 'Schedules' },
};

const notificationOptions = {
  causes: Joi.array().items(Joi.string()).label(FieldProps.Causes.LABEL),
  schedules: Joi.array().items(Joi.string()).label(FieldProps.Schedules.LABEL),
};

module.exports = Joi.object(notificationOptions);
