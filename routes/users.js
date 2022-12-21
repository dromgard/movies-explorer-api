const router = require('express').Router();

// Получаем схемы валидации входящих запросов через celebrate.
const { celebrateChangeAvatar, celebrateChangeProfile, celebrateUserId } = require('../validators/users');

// Получаем данные функций обработчиков запросов из "/controllers".
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

// Получаем всех пользователей.
router.get('/', getUsers);

// Получаем текущего пользователя.
router.get('/me', getCurrentUser);

// Получаем пользователя по id.
router.get('/:userId', celebrateUserId, getUserById);

// Обновляем профиль пользователя.
router.patch('/me', celebrateChangeProfile, updateUser);

// Обновляем аватар пользователя.
router.patch('/me/avatar', celebrateChangeAvatar, updateUserAvatar);

module.exports = router;
