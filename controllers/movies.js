const { Movie } = require('../models/movies');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const HTTPError = require('../errors/HTTPError');

// Возвращаем все сохранённые текущим пользователем фильмы.
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(new ServerError(err.message)));
};

// Создаём фильм.
module.exports.createMovie = (req, res, next) => {
  // Получаем данные из req.body.
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Удаляем сохранённый фильм по id.
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден.');
      } else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы.');
      } else {
        return movie.remove()
          .then(() => movie);
      }
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления фильма.'));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};
