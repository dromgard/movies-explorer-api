const router = require('express').Router();

// Получаем схемы валидации входящих запросов через celebrate.
const { celebrateChangeProfile } = require('../validators/users');

// Получаем данные функций обработчиков запросов из "/controllers".
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

// Получаем текущего пользователя.
router.get('/me', getCurrentUser);

// Обновляем профиль пользователя.
router.patch('/me', celebrateChangeProfile, updateUser);

module.exports = router;
