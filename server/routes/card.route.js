const express = require('express');
const passport = require('passport');
const router = express.Router();
const Card = require('../models/card.model');
const Column = require('../models/column.model');
const Note = require('../models/note.model');
module.exports = router;

// получение списка заметок карточки, метод - GET
router.get('/:cardId/notes', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // Вытаскиваем с БД список заметок карточки
  // exec -- exucution -выполнение запроса в БД
  Note.find({card: req.params.cardId}).exec((err, notes) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(notes);
  });

});

// сохранение заметки в БД
router.post('/:cardId/notes', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем с БД карточку
  const card = await Card.findById(req.params.cardId);

  // сохраняем в переменную данные с фронт энда + владельца заметки и ее картоку
  const noteData = {...req.body, owner: req.user._id, card: card._id};

  // засовываем данные в модель
  const newNote = new Note(noteData);

  // сохраняем данные
  const savedNote = await newNote.save();

  // добавляем ID заметки в массив заметок карточки
  card.notes.push(savedNote);

  // сохраняем карточку в БД и отдаем сохраненную заметку
  card.save((err, card) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedNote);
  });

});

// обновление позиции карточки
router.patch('/:cardId/update-position', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }
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
    await offsetPosition(previousColumnCards);
    await offsetPosition(currentColumnCards, false);

    // если перемещаем в одной колонке
  } else {

    // если мы переместили карточку вниз - находим карточки выше в колонке текущего положения карточки и нижего старого и сдвигаем их вверх
    if (req.body.currentIndex > req.body.previousIndex) {

      currentColumnCards = await Card.find({column: req.body.currentColumnId})
        .where('position')
        .lte(req.body.currentIndex)
        .gte(req.body.previousIndex).exec();

      await offsetPosition(currentColumnCards);
    } else {
      // если мы переместили карточку вверх - находим карточку ниже текущего положения и выше старого их сдвигаем вниз
      currentColumnCards = await Card.find({column: req.body.currentColumnId})
        .where('position')
        .gte(req.body.currentIndex)
        .lte(req.body.previousIndex).exec();

      await offsetPosition(currentColumnCards, false);
    }
  }
  // функция изменения позиции карточки
  async function offsetPosition(array, toDown = true) {

    // перебор карточек
    for (const item of array) {

      // если toDown - true - сдвигаем карточки вверх. в обратном случае - вниз
      toDown ? item.position = item.position - 1 : item.position = item.position + 1;

      // если находим текущую карточку - ставим позицию с фронт энда
      if (item._id.toString() === card._id.toString()) {
        item.position = req.body.currentIndex;
      }

      // сохраняем карточку
      await item.save();
    }
  }

  // вытаскиваем колонки
  const columns = await Column.find({ owner: req.user._id, board: currentColumn.board}).populate({ path: 'cards', options: { sort: 'position' }}).exec();

  res.json(columns);
});

// удаление карточки с БД
router.delete('/:cardId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем деталь карточки с БД вместе с ее владельцем
  const card = await Card.findById({_id: req.params.cardId}).populate('owner');

   // сохраняем в переменную ID владельца карточки
  const cardOwnerId = card.owner._id.toString();

  // сохраняем в переменную ID текущего пользователя
  const authUserId = req.user._id.toString();

  // сравниваем ID текущего пользователя и ID владельца карточки
  // если совпадают - вызываем метод remove(удаление с БД)
  if (cardOwnerId === authUserId) {
    await card.remove();
    res.send({message: 'Successfully deleted card!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
