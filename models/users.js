const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

// Схемы электронной почты и URL.
const emailRegex = /^([\w]+@([\w-]+\.)+[\w-]{2,4})?$/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => emailRegex.test(email),
      message: () => 'Введите корректный email в формате name@example.ru',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((data) => {
      if (!data) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, data.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          const user = data.toObject();
          delete user.password;
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
