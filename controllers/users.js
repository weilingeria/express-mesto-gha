const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const { NOT_FOUND_ERROR_CODE, BAD_DATA_CODE, SERVER_ERROR_CODE } = require('../utils/constants');

// Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

// Возвращаем пользователя по идентификатору
module.exports.getUserById = (req, res) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
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
  }
  throw new NotFound('Пользователь не найден');
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
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновляем информацию пользователя
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_DATA_CODE).send({ message: 'Пользователь с указанным _id не найден' });
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
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_DATA_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.status === 404) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
