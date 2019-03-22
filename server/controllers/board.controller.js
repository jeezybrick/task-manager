const Board = require('../models/board.model');
const Column = require('../models/column.model');
const utils = require('../shared/utils');

const errorMessage = 'Упс, что то пошло не так :(';

// получение списка досок, метод - GET
function getBoards(req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // Вытаскиваем с БД список досок текущего пользователя
  // exec -- exucution -выполнение запроса в БД
  Board.find({ user: req.user._id }).exec((err, boards) => {
    if (err) {
      res.status(404).send({message: errorMessage});
    }
    res.json(boards);
  });

}

// получение детали доски по id
function getBoardDetail(req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // Вытаскиваем с БД деталь доски
  Board.findById(req.params.boardId)
    // замена IDшников на данные колонок и карточек
    .populate({
      path: 'columns',
      populate: {path: 'cards', options: {sort: 'position'}}
    })
    .exec((err, board) => {
      if (err) {
        res.status(404).send({message: errorMessage});
      }
      res.json(board);
    });
}

// сохранение колонки в БД
async function saveColumn (req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // сохраняем в переменную данные с фронт энда + владельца колонки и ее доску
  const columnData = {...req.body, owner: req.user._id, board: req.params.boardId};

  // засовываем данные в модель
  const newColumn = new Column(columnData);

  // сохраняем данные
  const savedColumn = await newColumn.save();

  // добавляем ID колонки в массив колонок доски
  await Board.findOneAndUpdate({_id: req.params.boardId}, {$push: {columns: savedColumn._id}});

  // возвращаем сохраненную колонку
  res.json(savedColumn);

}

// удаление доски с БД
async function removeBoard (req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // вытаскиваем деталь доски с БД вместе с юзером
  const board = await Board.findById({_id: req.params.boardId}).populate('user');

  // проверяем является ли пользователь владельцем доски и удаляем если да
  await utils.userIsOwnerAndRemoveItem(board.user, req.user, board, res);

}

// создание доски
function createBoard(req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // в req.body - данные,присланные с фронт энда + добавляем текущего пользователя как user
  const boardData = {...req.body, user: req.user._id};
  // засовываем данные в модель
  const newBoard = new Board(boardData);

  // сохраняем данные в БД
  newBoard.save((err, board) => {
    if (err) {
       res.status(403).send({message: errorMessage});
    }
    res.json(board);
  });

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  getBoards,
  getBoardDetail,
  saveColumn,
  removeBoard,
  createBoard
};

