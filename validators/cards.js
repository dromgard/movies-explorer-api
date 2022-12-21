const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../models/users');

module.exports.celebrateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.celebrateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
