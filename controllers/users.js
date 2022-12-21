const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// Обрабатываем логин пользователя.
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = req.app.get('config');
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.name !== 'UnauthorizedError') {
        next(new ServerError(err.message));
      } else {
        next(err);
      }
    });
};

// Получаем всех пользователей.
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(new ServerError(err.message)));
};

// Получаем пользователя по id.
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch((err) => {
      next(new ServerError(err.message));
    });
};

// Получаем пользователя по id.
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Создаем пользователя.
module.exports.createUser = (req, res, next) => {
  // Получаем данные из req.body.
  const {
    email,
    password,
    name,
  } = req.body;
  // Создаем запись в БД и обрабатываем ошибку.
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Обновляем профиль пользователя.
module.exports.updateUser = (req, res, next) => {
  // Получаем данные из req.body.
  const { name, about } = req.body;
  const userId = req.user._id;
  // Создаем запись в БД и обрабатываем ошибку.
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден данные.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// Обновляем аватар пользователя.
module.exports.updateUserAvatar = (req, res, next) => {
  // Получаем данные из req.body.
  const { avatar } = req.body;
  const userId = req.user._id;
  // Создаем запись в БД и обрабатываем ошибку.
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден аватар.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};
