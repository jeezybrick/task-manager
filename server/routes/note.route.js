const express = require('express');
const passport = require('passport');
const router = express.Router();

const noteCtrl = require('../controllers/note.controller');
module.exports = router;

router.patch('/:noteId', passport.authenticate('jwt', {session: false}), noteCtrl.updateNote);
router.delete('/:noteId', passport.authenticate('jwt', {session: false}), noteCtrl.removeNote);

router.post('/:noteId/add-like', passport.authenticate('jwt', {session: false}), noteCtrl.addLike);
router.post('/:noteId/remove-like', passport.authenticate('jwt', {session: false}), noteCtrl.removeLike);
