const express = require('express');
const passport = require('passport');
const router = express.Router();
const Board = require('../models/board.model');
const Column = require('../models/column.model');
const Card = require('../models/card.model');
module.exports = router;


router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Column.find({ owner: req.user._id }).exec( (err, columns) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(columns);
  });

});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const board = await Board.findById({_id: req.body.boardId}).populate('user');
  const boardOwnerId = board.user._id.toString();
  const authUserId = req.user._id.toString();

  if (boardOwnerId === authUserId) {
    const columnData = {...req.body, owner: req.user._id};
    const newColumn = new Column(columnData);

    newColumn.save((err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});

router.post('/:columnId/cards', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const column = await Column.findById(req.params.columnId);

  const cardData = {...req.body, owner: req.user._id, column: column._id};
  const newCard = new Card(cardData);
  const savedCard = await newCard.save();

  column.cards.push(savedCard);
  column.save((err, column) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedCard);
  });

});

router.delete('/:columnId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const column = await Column.findById({_id: req.params.columnId}).populate('owner');
  const columnOwnerId = column.owner._id.toString();
  const authUserId = req.user._id.toString();

  if (columnOwnerId === authUserId) {

    await column.remove();
    res.send({message: 'Successfully deleted column!'});

  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});
