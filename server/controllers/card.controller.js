const Column = require('../models/column.model');
const Card = require('../models/card.model');
const Note = require('../models/note.model');
const utils = require('../shared/utils');
const dateFormat = require('dateformat');

// получение списка колонок, метод - GET
function getCardNotes(req, res) {

  // Вытаскиваем с БД список заметок карточки
  // exec -- exucution -выполнение запроса в БД
  Note.find({card: req.params.cardId}).exec((err, notes) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(notes);
  });

}

// сохранение карточки в БД
async function createNote(req, res) {

  // вытаскиваем с БД карточку
  const card = await Card.findById(req.params.cardId);

  // сохраняем в переменную данные с фронт энда + владельца заметки и ее картоку
  const noteData = {...req.body, owner: req.user._id, card: card._id};

  // засовываем данные в модель
  const newNote = new Note(noteData);

  // сохраняем данные
  let savedNote = await newNote.save();
  savedNote = await Note.findById(savedNote._id).populate('owner');

  // добавляем ID заметки в массив заметок карточки
  await Card.findOneAndUpdate({_id: card._id}, {$push: {notes: savedNote._id}});

  // отдаем сохраненную заметку
  res.json(savedNote);
}

// обновление позиции карточки
async function updateCardPosition(req, res) {


  // вытаскиваем деталь карточки с БД
  const card = await Card.findById(req.params.cardId);

  // вытаскиаем текущую колонку с БД
  const currentColumn = await Column.findById(req.body.currentColumnId);

  // переменная для карточки текущей колонки
  let currentColumnCards;

  // переменная для предыдущей колонки
  let previousColumn;

  // переменная для карточек предыдущей колонки
  let previousColumnCards;


  // если перемещаем с одной колонки в другую
  if (req.body.currentColumnId.toString() !== req.body.previousColumnId.toString()) {

    // вытаскиваем с Бд предыдущую колонку и записываем ее в переменную
    previousColumn = await Column.findById(req.body.previousColumnId);

    // вытаскиваем карточки предыущие колонки, которые быи ниже нее
    previousColumnCards = await Card.find({column: req.body.previousColumnId}).where('position').gt(req.body.previousIndex).exec();

    // вытаскиваем карточки текущей колонки ниже и равно позиции карточки
    currentColumnCards = await Card.find({column: req.body.currentColumnId}).where('position').gte(req.body.currentIndex).exec();

    // находим индекс карточки в массиве карточек преыдущей колонки и удаляем ее с массива
    const index = previousColumn.cards.findIndex((item) => item._id.toString() === card._id.toString());

    if (index > -1) {
      previousColumn.cards.splice(index, 1);
    }

    // присваеваем текущую колонку карточке
    card.column = currentColumn;

    // присваеваем текущую позиию карточке
    card.position = req.body.currentIndex;

    // добавляем картчоку в массив карточек текущей колонки
    currentColumn.cards.push(card._id);

    // сохраняем предыдущую колонку + текущую колонку и картчоку
    await previousColumn.save();
    await currentColumn.save();
    await card.save();


    // сдвигаем и сохраняем позиции для карточек преыущей и текущей колонки
    await offsetPosition(card, previousColumnCards, req.body.currentIndex);
    await offsetPosition(card, currentColumnCards, req.body.currentIndex, false);

    // если перемещаем в одной колонке
  } else {

    // если мы переместили карточку вниз - находим карточки выше в колонке текущего положения карточки и нижего старого и сдвигаем их вверх
    if (req.body.currentIndex > req.body.previousIndex) {

      currentColumnCards = await Card.find({column: req.body.currentColumnId})
        .where('position')
        .lte(req.body.currentIndex)
        .gt(req.body.previousIndex).exec();

      await offsetPosition(card, currentColumnCards, req.body.currentIndex);

    } else {
      // если мы переместили карточку вверх - находим карточку ниже текущего положения и выше старого их сдвигаем вниз
      currentColumnCards = await Card.find({column: req.body.currentColumnId})
        .where('position')
        .gte(req.body.currentIndex)
        .lt(req.body.previousIndex).exec();

      await offsetPosition(card, currentColumnCards, req.body.currentIndex, false);
    }

    card.position = req.body.currentIndex;
    await card.save();
  }
  const cards = await Card
    .find({column: req.body.currentColumnId})
    .sort('position')
    .exec();

  res.json(cards);
}

// обновление данных заметки с БД
async function updateCard(req, res) {

  // вытаскиваем с БД карточку вместе с ее владельцем
  const card = await Card.findById({_id: req.params.cardId}).populate('owner').exec();

  // проверяем является ли пользователь владельцем карточки
  if (!utils.isUserOwner(card.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // сохраняем в переменную данные с фронт энда + владельца карточки
  const cardData = Object.assign(card, req.body, {owner: req.user._id});

  // засовываем данные в модель
  const updatedCard = new Card(cardData);

  // сохраняем данные
  let savedCard = await updatedCard.save();
  savedCard = await Card.findById(savedCard._id).populate('users')

  // возвращаем обновленную карточку
  res.json(savedCard);

}

// удаление карточки с БД
async function removeCard(req, res) {

  // вытаскиваем деталь карточки с БД вместе с ее владельцем
  const card = await Card.findById({_id: req.params.cardId}).populate('owner');

  // проверяем является ли пользователь владельцем карточки
  if (!utils.isUserOwner(card.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // удаляем карточку
  await card.remove();

  // сдвигаем вверх (уменьшаем позиции на минус 1) и сохраняем позиции для карточек колонки
  const columnBeyondCards = await Card.find({column: card.column}).where('position').gt(card.position).exec();
  await offsetPosition(card, columnBeyondCards);

  // удаляем ID карточки в массива карточек родительской колонки
  await Column.findOneAndUpdate({_id: card.column}, {$pull: {cards: card._id}});

  const columnCards = await Card.find({column: card.column})
    .populate({
      path: 'notes',
      populate: {path: 'owner'}
    })
    .populate('users')
    .sort('position')
    .exec();

  // возвращаем карточки
  res.json(columnCards);

}

// функция изменения позиции карточки
async function offsetPosition(item, array, currentIndex = null, toDown = true) {

  // перебор карточек
  for (const arrayItem of array) {

    // если toDown - true - сдвигаем карточки вверх. в обратном случае - вниз
    toDown ? arrayItem.position = arrayItem.position - 1 : arrayItem.position = arrayItem.position + 1;

    // если находим текущую карточку - ставим позицию с фронт энда
    if (arrayItem._id.toString() === item._id.toString() && currentIndex) {
      arrayItem.position = currentIndex;
    }

    // сохраняем карточку
    await arrayItem.save();
  }
}

async function addUsersToCard(req, res) {
  const card = await Card
    .findOneAndUpdate({_id: req.params.cardId}, {$push: {users: {$each: req.body.users}}}, {new: true})
    .populate('users')
    .exec();
  res.json(card.users);
}

async function removeUsersFromCard(req, res) {
  const card = await Card
    .findOneAndUpdate({_id: req.params.cardId}, {$pull: {users: {$in: req.body.users}}}, {new: true, multi: true})
    .populate('users')
    .exec();
  res.json(card.users);
}

function logTime(req, res) {
  Card
    .findOneAndUpdate({_id: req.params.cardId}, {$push: {loggedTime: {...req.body}}}, {new: true})
    .populate('users')
    .exec((err, card) => {
      if (err) {
        res.status(404).send({message: 'Oh uh, something went wrong'});
      }
      res.json(card);
    })
}

function estimateTime(req, res) {
  Card
    .findOneAndUpdate({_id: req.params.cardId}, {estimateTime: {...req.body}}, {new: true})
    .populate('users')
    .exec((err, card) => {
      if (err) {
        res.status(404).send({message: 'Oh uh, something went wrong'});
      }
      res.json(card);
    })

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  getCardNotes,
  createNote,
  updateCardPosition,
  updateCard,
  removeCard,
  addUsersToCard,
  removeUsersFromCard,
  logTime,
  estimateTime,
};

