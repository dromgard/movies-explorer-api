const router = require('express').Router();

// Получаем схемы валидации входящих запросов через celebrate.
const { celebrateCreateCard, celebrateCardId } = require('../validators/cards');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Получаем все карточки.
router.get('/', getCards);

// Создаём карточку.
router.post('/', celebrateCreateCard, createCard);

// Удаляем карточку.
router.delete('/:cardId', celebrateCardId, deleteCard);

// Ставим лайк карточке.
router.put('/:cardId/likes', celebrateCardId, likeCard);

// Удаляем лайк у карточки.
router.delete('/:cardId/likes', celebrateCardId, dislikeCard);

module.exports = router;
