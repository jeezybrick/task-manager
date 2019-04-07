const express = require('express');
const passport = require('passport');
const router = express.Router();
const noteCtrl = require('../controllers/note.controller');
module.exports = router;

router.delete('/:noteId', passport.authenticate('jwt', {session: false}), noteCtrl.removeNote);
