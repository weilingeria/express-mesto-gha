const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const { NOT_FOUND_ERROR_CODE, BAD_DATA_CODE, SERVER_ERROR_CODE } = require('../utils/constants');

// Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по-умолчанию' }));
};

// Возвращаем пользователя по идентификатору
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный _id' });
      } else if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'BadRequest') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновляем информацию пользователя
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'BadRequest') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_DATA_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.status === 404) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'BadRequest') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_DATA_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.status === 404) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
