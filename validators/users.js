const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../models/users');

module.exports.celebrateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.celebrateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.celebrateChangeAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.celebrateChangeProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.celebrateUserId = celebrate({
  params: Joi.object({
    userId: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
    ).required(),
  }).required(),
});
