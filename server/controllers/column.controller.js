const Board = require('../models/board.model');
const Column = require('../models/column.model');
const Card = require('../models/card.model');
const utils = require('../shared/utils');

const errorMessage = 'Упс, что то пошло не так :(';

// получение списка колонок, метод - GET
function getColumns(req, res) {

  // Вытаскиваем с БД список колонок текущего пользователя
  // exec -- exucution -выполнение запроса в БД
  Column.find({ owner: req.user._id }).exec( (err, columns) => {
    if (err) {
      res.status(404).send({message: errorMessage});
    }
    res.json(columns);
  });

}

function getCards(req, res) {

  Card.find({ column: req.params.columnId }).exec( (err, cards) => {
    if (err) {
      res.status(404).send({message: errorMessage});
    }
    res.json(cards);
  });

}

// сохранение карточки в БД
async function createCard (req, res) {
  const users = req.body.users || [];

  // вытаскиваем с БД колонку, которой будет принадлежать карточка
  const column = await Column.findById(req.params.columnId);

  // сохраняем в переменную данные с фронт энда + владельца карточки и ее колонку
  // позиция = общему количеству карточек + 1
  const cardData = {
    ...req.body,
    position: column.cards.length + 1,
    owner: req.user._id,
    column: column._id,
    users: [...users, req.user._id],
    notifiedUsers: [req.user._id],
  };

  // засовываем данные в модель
  const newCard = new Card(cardData);

  // сохраняем данные
  const savedCard = await newCard.save();

  // добавляем ID карточки в массив карточек колонки
  await Column.findOneAndUpdate({_id: column._id}, {$push: {cards: savedCard._id}});

  // отдаем сохраненную карточку
  res.json(savedCard);

}

// удаление колонки с БД
async function removeColumn (req, res) {

  // вытаскиваем деталь колонки с БД вместе с ее владельцем
  const column = await Column.findById({_id: req.params.columnId}).populate('owner');

  // проверяем является ли пользователь владельцем колонки
  if (!utils.isUserOwner(column.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // удаляем заметку
  await column.remove();

  // удаляем ID колонки в массива колонок родительской доски
  await Board.findOneAndUpdate({_id: column.board}, {$pull: {columns: column._id}});

  // возвращаем удаленную колонок
  res.json(column);

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  getColumns,
  createCard,
  removeColumn,
  getCards,
};

