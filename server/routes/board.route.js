const express = require('express');
const passport = require('passport');
const router = express.Router();
const Board = require('../models/board.model');
const Column = require('../models/column.model');
module.exports = router;

router.get('', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Board.find({ user: req.user._id }).exec((err, boards) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(boards);
  });

});

router.get('/:boardId', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  Board.findById(req.params.boardId)
    .populate({path: 'columns', populate: { path: 'cards' }})
    .exec((err, board) => {
    if (err) {
      res.status(404).send({message: 'Oh uh, something went wrong'});
    }
    res.json(board);
  });

});

router.post('/:boardId/columns', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const board = await Board.findById(req.params.boardId);

  const columnData = {...req.body, owner: req.user._id, board: board._id};
  const newColumn = new Column(columnData);
  const savedColumn = await newColumn.save();

  board.columns.push(savedColumn);
  board.save((err, board) => {
    if (err) {
      res.status(404).send(err);
    }

    res.json(savedColumn);
  });

});

router.delete('/:boardId', passport.authenticate('jwt', {session: false}), async (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const board = await Board.findById({_id: req.params.boardId}).populate('user');
  const boardOwnerId = board.user._id.toString();
  const authUserId = req.user._id.toString();


  if (boardOwnerId === authUserId) {
    await board.remove();
    res.send({message: 'Successfully deleted board!'});
  } else {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

  if (!req.user) {
    res.status(403).send({message: 'Oh uh, something went wrong'});
  }

  const boardData = {...req.body, user: req.user._id};
  const newBoard = new Board(boardData);

  newBoard.save((err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json(contact);
  });

});

