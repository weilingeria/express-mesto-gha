const Card = require('../models/card');
const NotFound = require('../errors/NotFoundError');
const { BAD_DATA_CODE, SERVER_ERROR_CODE } = require('../utils/constants');

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

// Создаем новую карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_DATA_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Находим карточку по id и удаляем
module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndRemove(req.params.cardId, { runValidators: true })
      .then((card) => res.send({ data: card, message: 'Карточка удалена' }))
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
  throw new NotFound('Карточка с указанным _id не найдена');
};

// Ставим лайк
module.exports.putCardLike = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true },
    )
      .then((card) => res.send({ data: card.likes }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный id' });
        } else if (err.status === 404) {
          res.status(err.status).send({ message: err.message });
        } else {
          res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  }
  throw new NotFound('Карточка с указанным _id не найдена');
};

// Убираем лайк
module.exports.removeCardLike = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true },
    )
      .then((card) => res.send({ data: card.likes }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный id' });
        } else if (err.status === 404) {
          res.status(err.status).send({ message: err.message });
        } else {
          res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  }
  throw new NotFound('Карточка с указанным _id не найдена');
};
