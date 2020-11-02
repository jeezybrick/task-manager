const Board = require('../models/board.model');
const Column = require('../models/column.model');
const utils = require('../shared/utils');

const boardSocketChannelNames = {
  attachedToBoardChannelName: 'attachedToBoard',
  deAttachedToBoardChannelName: 'deAttachedFromBoard',
}
const errorMessage = 'Упс, что то пошло не так :(';

// получение списка досок, метод - GET
function getBoards(req, res) {

  // Вытаскиваем с БД список досок текущего пользователя
  // exec -- exucution -выполнение запроса в БД
  Board.find()
    .where('users').in([req.user._id])
    .populate({
      path: 'columns',
      populate: {path: 'cards', options: {sort: 'position'}}
    })
    .populate({
      path: 'users',
    })
    .sort([[req.query.sortBy, req.query.sortDirection]])
    .exec((err, boards) => {
    if (err) {
      res.status(404).send({message: errorMessage});
    }
    res.json(boards);
  });

}

// получение детали доски по id
function getBoardDetail(req, res) {

  // Вытаскиваем с БД деталь доски
  Board.findById(req.params.boardId)
    // замена IDшников на данные колонок и карточек
    .populate({
      path: 'columns',
      populate: {path: 'cards', options: {sort: 'position'}}
    })
    .populate({
      path: 'users',
    })
    .exec((err, board) => {
      if (err) {
        res.status(404).send({message: errorMessage});
      }
      res.json(board);
    });
}

// сохранение колонки в БД
async function saveColumn(req, res) {
  // сохраняем в переменную данные с фронт энда + владельца колонки и ее доску
  const columnData = {...req.body, owner: req.user._id, board: req.params.boardId};

  // засовываем данные в модель
  const newColumn = new Column(columnData);

  // сохраняем данные
  const savedColumn = await newColumn.save();

  // добавляем ID колонки в массив колонок доски
  await Board.findOneAndUpdate({_id: req.params.boardId}, {$push: {columns: savedColumn._id}});

  // возвращаем сохраненную колонку
  if(res) {
    res.json(savedColumn);
  } else {
    return savedColumn;
  }

}

async function addUsersToBoard(req, res) {
  const board = await Board
    .findOneAndUpdate({_id: req.params.boardId}, {$push: {users: {$each: req.body.users}}}, {new: true})
    .populate('users')
    .exec();

  board.users.forEach((user) => {
    const socketId = global.socketUsers.find(item => item.userId === user._id);

    if (socketId) {
      global.io.to(socketId).emit(boardSocketChannelNames.attachedToBoardChannelName, {board});
    }
  })

  res.json(board.users);
}

async function removeUsersFromBoard(req, res) {
  const board = await Board
    .findOneAndUpdate({_id: req.params.boardId}, {$pull: { users: { $in: req.body.users }}}, {new: true, multi: true})
    .populate('users')
    .exec();
  res.json(board.users);
}

// удаление доски с БД
async function removeBoard(req, res) {

  // вытаскиваем деталь доски с БД вместе с юзером
  const board = await Board.findById({_id: req.params.boardId}).populate('owner');

  // проверяем является ли пользователь владельцем доски
  if (!utils.isUserOwner(board.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // удаляем доску
  await board.remove();

  // возвращаем удаленную доску
  res.json(board);

}

// создание доски
async function createBoard(req, res) {
  const users = req.body.users || [];
  const type = req.body.type;

  // в req.body - данные,присланные с фронт энда + добавляем текущего пользователя как user
  const boardData = {
    ...req.body,
    user: req.user._id,
    owner: req.user._id,
    users: [...users, req.user._id],
    notifiedUsers: [req.user._id],
  };
  // засовываем данные в модель
  const newBoard = new Board(boardData);
  let savedBoard = await newBoard.save();

  if (type) {
    await addColumnsByBoardType(savedBoard.type, savedBoard._id, req.user._id);
    savedBoard = await Board.findById(savedBoard._id)
        .populate({
          path: 'columns',
          populate: {path: 'cards', options: {sort: 'position'}}
        })
        .populate({
          path: 'users',
        });
  }

  res.json(savedBoard);

}

async function getIsCurrentUserNotifiedAboutAttachedBoards(req, res) {
  const boards = await Board.find()
    .where('users').in([req.user._id])
    .where('notifiedUsers').nin([req.user._id])
    .exec();

  if (boards.length) {
    for (const board of boards) {
      await Board.findByIdAndUpdate(board._id, {notifiedUsers: board.users}).exec();
    }
  }

  res.json(!boards.length);
}

function getColumns(req, res) {

  Board.findById(req.params.boardId)
    .populate('columns')
    .exec((err, board) => {
      if (err) {
        res.status(404).send({message: errorMessage});
      }
      res.json(board.columns);
    });

}

async function addColumnsByBoardType(boardType, boardId, userId) {
  let columnsNames = [];

  switch (boardType) {
    case 'scrum':
      columnsNames = ['Резерв', 'До роботи', 'У роботі', 'Заблоковано', 'Тест', 'Виконано'];
      break;
    case 'kanban':
      columnsNames = ['Резерв', 'До роботи', 'У роботі', 'Заблоковано', 'Тест', 'Виконано'];
      break;
    case 'waterflow':
      columnsNames = ['Резерв', 'До роботи', 'У роботі', 'Тест', 'Виконано'];
      break;
  }

  for (const columnName of columnsNames) {
    const req = {body: {name: columnName}, user: {_id: userId, }, params: {boardId}}
    await saveColumn(req);
  }
}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  getBoards,
  getBoardDetail,
  saveColumn,
  removeBoard,
  createBoard,
  getIsCurrentUserNotifiedAboutAttachedBoards,
  addUsersToBoard,
  removeUsersFromBoard,
  getColumns,
};

