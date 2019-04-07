const express = require('express');
const passport = require('passport');
const router = express.Router();

const cardCtrl = require('../controllers/card.controller');

module.exports = router;

// получение списка заметок карточки, метод - GET
router.get('/:cardId/notes', passport.authenticate('jwt', {session: false}), cardCtrl.getCardNotes);

// сохранение заметки в БД
router.post('/:cardId/notes', passport.authenticate('jwt', {session: false}), cardCtrl.createNote);

// обновление позиции карточки
router.patch('/:cardId/update-position', passport.authenticate('jwt', {session: false}), cardCtrl.updateCardPosition);

// удаление карточки с БД
router.delete('/:cardId', passport.authenticate('jwt', {session: false}), cardCtrl.removeCard);
