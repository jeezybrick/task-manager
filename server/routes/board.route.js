// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();

const boardCtrl = require('../controllers/board.controller');
module.exports = router;

// получение списка досок, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), boardCtrl.getBoards);

router.get('/checkIsNotified', passport.authenticate('jwt', {session: false}), boardCtrl.getIsCurrentUserNotifiedAboutAttachedBoards);

router.post('/:boardId/add-users', passport.authenticate('jwt', {session: false}), boardCtrl.addUsersToBoard);

// получение детали доски по id
router.get('/:boardId', passport.authenticate('jwt', {session: false}), boardCtrl.getBoardDetail);

// сохранение колонки в БД
router.post('/:boardId/columns', passport.authenticate('jwt', {session: false}), boardCtrl.saveColumn);

// удаление доски с БД
router.delete('/:boardId', passport.authenticate('jwt', {session: false}), boardCtrl.removeBoard);

// создание доски, метод - POST
router.post('/', passport.authenticate('jwt', {session: false}), boardCtrl.createBoard);


