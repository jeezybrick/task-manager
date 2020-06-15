const Card = require('../models/card.model');
const Note = require('../models/note.model');
const utils = require('../shared/utils');

// обновление данных заметки с БД
async function updateNote(req, res) {

  // вытаскиваем с БД заметку вместе с ее владельцем
  const note = await Note.findById({_id: req.params.noteId}).populate('owner').exec();

  // проверяем является ли пользователь владельцем заметки
  if (!utils.isUserOwner(note.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // сохраняем в переменную данные с фронт энда + владельца заметки
  const noteData = Object.assign(note, req.body, {owner: req.user._id});

  // засовываем данные в модель
  const updatedNote = new Note(noteData);

  // сохраняем данные
  const savedNote = await updatedNote.save();

  // возвращаем обновленную заметку
  res.json(savedNote);

}

async function addLike(req, res) {
  const note = await Note
    .findOneAndUpdate({_id: req.params.noteId}, {$push: {likes: req.user._id}}, {new: true})
    .exec();

  res.json(note);
}

async function removeLike(req, res) {
  const note = await Note
    .findOneAndUpdate({_id: req.params.noteId}, {$pull: {likes: req.user_id}}, {new: true})
    .exec();

  res.json(note);
}

// удаление заметки с БД
async function removeNote(req, res) {

  // вытаскиваем с БД заметку вместе с ее владельцем
  const note = await Note.findById({_id: req.params.noteId}).populate('owner');

  // проверяем является ли пользователь владельцем заметки
  if (!utils.isUserOwner(note.owner, req.user)) {
    res.status(403).send({message: utils.getAuthErrorMessage()});
    return;
  }

  // удаляем заметку
  await note.remove();

  // удаляем ID заметки в массива заметок родительской карточки
  await Card.findOneAndUpdate({_id: note.card}, {$pull: {notes: note._id}});

  // возвращаем удаленную заметку
  res.json(note);

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  updateNote,
  removeNote,
  addLike,
  removeLike,
};

