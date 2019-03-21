const express = require('express');
const passport = require('passport');
const router = express.Router();
const Note = require('../models/note.model');
module.exports = router;

router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Note.find({ owner: req.user._id }).exec( (err, cards) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(cards);
  });

});

router.delete('/:noteId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const note = await Note.findById({_id: req.params.noteId}).populate('owner');
  const cardOwnerId = note.owner._id.toString();
  const authUserId = req.user._id.toString();


  if (cardOwnerId === authUserId) {
    await note.remove();
    res.send({message: 'Successfully deleted note!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
