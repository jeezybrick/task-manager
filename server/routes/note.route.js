const express = require('express');
const passport = require('passport');
const router = express.Router();
const Note = require('../models/note.model');
module.exports = router;

router.delete('/:noteId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  // вытаскиваем с БД заметку вместе с ее владельцем
  const note = await Note.findById({_id: req.params.noteId}).populate('owner');

  // сохраняем в переменную ID владельца заметки
  const noteOwnerId = note.owner._id.toString();

  // сохраняем в переменную ID текущего пользователя
  const authUserId = req.user._id.toString();

  // сравниваем ID текущего пользователя и ID владельца заметки
  // если совпадают - вызываем метод remove(удаление с БД)
  if (noteOwnerId === authUserId) {
    await note.remove();
    res.send({message: 'Successfully deleted note!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
