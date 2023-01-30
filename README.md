# Backend для дипломного проекта "Поиск фильмов"

:exclamation:С 30.01.2023 разработка проекта ведется в общем с фронтендом репозитории - https://github.com/dromgard/movies-explorer-api-full

### Описание проекта:

Backend реализован на ExpressJS, MongoDB + Mongoose. Реализована валидация данных на уровне схемы, плюс используется Celebrate, Joi. Количество запросов на сервер регулируется через express-rate-limit. Для логирования используется Winston.

### Технологии:

<img src="https://img.shields.io/badge/Node.js-blue?logo=node.js&logoColor=white" alt="node.js" title="node.js"/> <img src="https://img.shields.io/badge/ExpressJS-blue?logo=express&logoColor=white" alt="ExpressJS" title="ExpressJS"/> <img src="https://img.shields.io/badge/MongoDB-blue?logo=MongoDB&logoColor=white" alt="MongoDB" title="MongoDB"/>

- Для хранения данных используется MongoDB + Mongoose.
- Реализована валидация данных на уровне схемы, плюс используется Celebrate, Joi.
- Количество запросов на сервер регулируется через express-rate-limit.
- Для логирования используется Winston.

### Публикация в интернете:

[Backend - https://api.diploma-serhio.nomoredomains.club](https://api.diploma-serhio.nomoredomains.club)

### Запуск проекта

Требования:

- Node.js >= 14;
- npm >= 6.14;

Backend:

- `npm run start` — запускает сервер в режиме production.
- `npm run dev` — запускает сервер с hot-reload в режиме разработчика.
