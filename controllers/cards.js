const Card = require('../models/cards');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const HTTPError = require('../errors/HTTPError');

// Получаем все карточки.
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(new ServerError(err.message)));
};

// Создаём карточку.
module.exports.createCard = (req, res, next) => {
  // Получаем данные из req.body.
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Удаляем карточку.
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      } else if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки.');
      } else {
        return card.remove()
          .then(() => card);
      }
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Ставим лайк карточке.
module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Удаляем лайк у карточки.
module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};
