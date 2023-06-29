const Joi = require('joi');
const userRolesEnum = require('../constants/userRolesEnum');

const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
      password: Joi.string().regex(PASSWD_REGEX).required(),
      role: Joi.string().valid(...Object.values(userRolesEnum)), // 'user', 'admin', 'moderator'
    })
    .validate(data);

exports.signupUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
      password: Joi.string().regex(PASSWD_REGEX).required(),
    })
    .validate(data);

exports.updateUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    })
    .validate(data);
