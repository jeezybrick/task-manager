const express = require('express');
const passport = require('passport');
const router = express.Router();
const Card = require('../models/card.model');
const Note = require('../models/note.model');
module.exports = router;

router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Card.find({ owner: req.user._id }).exec( (err, cards) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(cards);
  });

});

router.get('/:cardId/notes', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Note.find({card: req.params.cardId}).exec((err, notes) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(notes);
  });

});

router.post('/:cardId/notes', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const card = await Card.findById(req.params.cardId);
  const noteData = {...req.body, owner: req.user._id, card: card._id};
  const newNote = new Note(noteData);
  const savedNote = await newNote.save();

  card.notes.push(savedNote);
  card.save((err, card) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedNote);
  });

});


router.delete('/:cardId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const card = await Card.findById({_id: req.params.cardId}).populate('owner');
  console.log(card);
  const cardOwnerId = card.owner._id.toString();
  const authUserId = req.user._id.toString();


  if (cardOwnerId === authUserId) {
    await card.remove();
    res.send({message: 'Successfully deleted card!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
