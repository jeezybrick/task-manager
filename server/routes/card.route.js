const express = require('express');
const passport = require('passport');
const router = express.Router();

const cardCtrl = require('../controllers/card.controller');
module.exports = router;

// получение списка заметок карточки, метод - GET
router.get('/:cardId/notes', passport.authenticate('jwt', {session: false}), cardCtrl.getCardNotes);

// сохранение заметки в БД
router.post('/:cardId/notes', passport.authenticate('jwt', {session: false}), cardCtrl.createNote);

router.post('/:cardId/add-users', passport.authenticate('jwt', {session: false}), cardCtrl.addUsersToCard);

router.post('/:cardId/remove-users', passport.authenticate('jwt', {session: false}), cardCtrl.removeUsersFromCard);

router.post('/:cardId/log-time', passport.authenticate('jwt', {session: false}), cardCtrl.logTime);

router.post('/:cardId/estimate-time', passport.authenticate('jwt', {session: false}), cardCtrl.estimateTime);

// обновление позиции карточки
router.patch('/:cardId/update-position', passport.authenticate('jwt', {session: false}), cardCtrl.updateCardPosition);

// обновление данных карточки
router.patch('/:cardId', passport.authenticate('jwt', {session: false}), cardCtrl.updateCard);

// удаление карточки с БД
router.delete('/:cardId', passport.authenticate('jwt', {session: false}), cardCtrl.removeCard);
