const router = require('express').Router();

// Получаем схемы валидации входящих запросов через celebrate.
const { celebrateCreateMovie, celebrateMovieId } = require('../validators/movies');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// Возвращаем все сохранённые текущим пользователем фильмы.
router.get('/', getMovies);

// Создаём фильм.
router.post('/', celebrateCreateMovie, createMovie);

// Удаляем сохранённый фильм по id.
router.delete('/:_id', celebrateMovieId, deleteMovie);

module.exports = router;
