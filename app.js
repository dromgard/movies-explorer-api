const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');

// Получаем данные функций обработчиков запросов из "/controllers".
const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

// Получаем схемы валидации входящих запросов через celebrate.
const { celebrateCreateUser, celebrateLoginUser } = require('./validators/users');

const NotFoundError = require('./errors/NotFoundError');

// Получаем логгеры, rate-limit и централизованный обрабочик ошибок.
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3001, dbName = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

mongoose.set({ runValidators: true });
mongoose.connect(dbName);

// Обработка res.body в json.
app.use(bodyParser.json());

app.use(cors(
  {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
));
// app.options('*', cors());

// Записываем в конфиг соль для шифрования пароля.
// dotenv.config();
const config = dotenv.config({
  path: path
    .resolve(process.env.NODE_ENV === 'production' ? '.env' : '.env.common'),
}).parsed;

app.set('config', config);

// Подключаем логгер запросов для всех роутов.
app.use(requestLogger);

// Подключаем helmet для защиты приложения от некоторых широко известных веб-уязвимостей.
app.use(helmet());

// Подключаем rate-limit для ограничения количества запросов.
app.use(rateLimiter);

// Краштест для ревью.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Обрабатываем логин.
app.post('/signin', celebrateLoginUser, login);

// Обрабатываем регистрацию.
app.post('/signup', celebrateCreateUser, createUser);

app.use(auth);

// Обрабатываем роуты пользователей - "/users".
app.use('/users', require('./routes/users'));

// Обрабатываем роуты карточек - "/cards".
app.use('/movies', require('./routes/movies'));

// Обрабатываем несуществующие роуты.
app.use((req, res, next) => next(new NotFoundError('Страница не найдена.')));

// Подключаем логгер ошибок.
app.use(errorLogger);

// Обработчик ошибок celebrate.
app.use(errors());

// Централизованный обработчик ошибок.
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
