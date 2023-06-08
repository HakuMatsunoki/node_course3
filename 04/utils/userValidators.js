const Joi = require('joi');

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(10).required(),
      year: Joi.number().min(1900).max(2020).required(),
    })
    .validate(data);
