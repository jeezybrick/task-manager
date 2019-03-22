const Card = require('../models/card.model');
const Note = require('../models/note.model');
const utils = require('../shared/utils');

// удаление заметки с БД
async function removeNote(req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // вытаскиваем с БД заметку вместе с ее владельцем
  const note = await Note.findById({_id: req.params.noteId}).populate('owner');

  // проверяем является ли пользователь владельцем заметки и удаляем если да
  await utils.userIsOwnerAndRemoveItem(note.owner, req.user, note, res);

  // удаляем ID карточки в массива карточек родительской колонки
  await Card.findOneAndUpdate({_id: note.card}, {$pull: {notes: note._id}});

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  removeNote
};

