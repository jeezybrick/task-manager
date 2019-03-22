// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const columnCtrl = require('../controllers/column.controller');
module.exports = router;

// получение списка колонок, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), columnCtrl.getColumns);

// сохранение карточки в БД
router.post('/:columnId/cards', passport.authenticate('jwt', {session: false}), columnCtrl.createCard);

// удаление колонки с БД
router.delete('/:columnId', passport.authenticate('jwt', {session: false}),columnCtrl.removeColumn);
