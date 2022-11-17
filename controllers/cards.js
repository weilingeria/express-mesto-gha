const Card = require('../models/card');
const { NOT_FOUND_ERROR_CODE, BAD_DATA_CODE, SERVER_ERROR_CODE } = require('../utils/constants');
const NotFound = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Нет карточки с таким id');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Карточка другого пользователя');
      }
      return Card.findByIdAndRemove(req.params.cardId).then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный _id' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

// Ставим лайк
module.exports.putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card.likes });
      }
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный id' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

// Убираем лайк
module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card.likes });
      }
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_DATA_CODE).send({ message: 'Передан некорректный id' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
