// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Board = require('../models/board.model');
const Column = require('../models/column.model');
module.exports = router;

// получение списка досок, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  // проверка на пользователя
  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // Вытаскиваем с БД список досок текущего пользователя
  // exec -- exucution -выполнение запроса в БД
  Board.find({ user: req.user._id }).exec((err, boards) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(boards);
  });

});

// получение детали доски по id
router.get('/:boardId', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // Вытаскиваем с БД деталь доски
  Board.findById(req.params.boardId)
    // замена IDшников на данные колонок и карточек
    .populate({
      path: 'columns',
      populate: {path: 'cards', options: {sort: 'position'}}
    })
    .exec((err, board) => {
      if (err) {
        res.status(404).send({message: 'Oh uh, something went wrong'});
      }
      res.json(board);
    });

});

// сохранение колонки в БД
router.post('/:boardId/columns', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем с БД доску
  const board = await Board.findById(req.params.boardId);

  // сохраняем в переменную данные с фронт энда + владельца колонки и ее доску
  const columnData = {...req.body, owner: req.user._id, board: board._id};

  // засовываем данные в модель
  const newColumn = new Column(columnData);

  // сохраняем данные
  const savedColumn = await newColumn.save();

  // добавляем ID колонки в массив колонок доски
  board.columns.push(savedColumn);

  // сохраняем доску в БД и отдаем сохраненную колонку
  board.save((err, board) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedColumn);
  });

});

// удаление доски с БД
router.delete('/:boardId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем деталь доски с БД вместе с юзером
  const board = await Board.findById({_id: req.params.boardId}).populate('user');

  // сохраняем в переменную ID владельца доски
  const boardOwnerId = board.user._id.toString();

  // сохраняем в переменную ID текущего пользователя
  const authUserId = req.user._id.toString();


  // сравниваем ID текущего пользователя и ID владельца доски
  // если совпадают - вызываем метод remove(удаление с БД)
  if (boardOwnerId === authUserId) {
    await board.remove();
    res.send({message: 'Successfully deleted board!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});

// создание доски, метод - POST
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // в req.body - данные,присланные с фронт энда + добавляем текущего пользователя как user
  const boardData = {...req.body, user: req.user._id};
  // засовываем данные в модель
  const newBoard = new Board(boardData);

  // сохраняем данные в БД
  newBoard.save((err, board) => {
    if (err) {
       res.status(403).send({message: 'Oh uh, something went wrong'});
    }
    res.json(board);
  });

});

