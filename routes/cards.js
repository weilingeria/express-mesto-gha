const router = require('express').Router();

const {
  getCard,
  createCard,
  deleteCard,
  putCardLike,
  removeCardLike,
} = require('../controllers/cards');

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putCardLike);
router.delete('/:cardId/likes', removeCardLike);

module.exports = router;
