// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Board = require('../models/board.model');
const Column = require('../models/column.model');
const Card = require('../models/card.model');
module.exports = router;

// получение списка колонок, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  // проверка на пользователя
  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // Вытаскиваем с БД список колонок текущего пользователя
  // exec -- exucution -выполнение запроса в БД
  Column.find({ owner: req.user._id }).exec( (err, columns) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(columns);
  });

});

// сохранение карточки в БД
router.post('/:columnId/cards', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем с БД колонку, которой будет принадлежать карточка
  const column = await Column.findById(req.params.columnId);

  // сохраняем в переменную данные с фронт энда + владельца карточки и ее колонку
  // позиция = общему количеству карточек + 1
  const cardData = {
    ...req.body,
    position: column.cards.length + 1,
    owner: req.user._id,
    column: column._id
  };
  // засовываем данные в модель
  const newCard = new Card(cardData);
  // сохраняем данные
  const savedCard = await newCard.save();

  // добавляем ID карточки в массив карточек колонки
  column.cards.push(savedCard);
  // сохраняем колонку в БД и отдаем сохраненную карточку
  column.save((err, column) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedCard);
  });

});

// удаление колонки с БД
router.delete('/:columnId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем деталь колонки с БД вместе с ее владельцем
  const column = await Column.findById({_id: req.params.columnId}).populate('owner');
  // сохраняем в переменную ID владельца колонки
  const columnOwnerId = column.owner._id.toString();
  // сохраняем в переменную ID текущего пользователя
  const authUserId = req.user._id.toString();

  // сравниваем ID текущего пользователя и ID владельца колонки
  // если совпадают - вызываем метод remove(удаление с БД)
  if (columnOwnerId === authUserId) {

    await column.remove();
    res.send({message: 'Successfully deleted column!'});

  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
