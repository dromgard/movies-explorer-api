const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
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

// Получаем пользователя по id.
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((document) => {
      if (document) {
        const user = document.toObject();
        delete user._id;
        res.send({ user });
      } else {
        next(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch((err) => {
      next(new ServerError(err.message));
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
  const { email, name } = req.body;
  const userId = req.user._id;
  // Проверяем на дубль почты.
  User.findOne({ email })
    .then((data) => {
      if (data) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        // Создаем запись в БД и обрабатываем ошибку.
        User.findByIdAndUpdate(userId, { email, name }, { new: true })
          .then((document) => {
            if (document) {
              const user = document.toObject();
              delete user._id;
              res.send({ data: user });
            } else {
              next(new NotFoundError('Пользователь не найден.'));
            }
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Переданы некорректные данные.'));
            } else {
              next(new ServerError(err.message));
            }
          });
      }
    });
};
