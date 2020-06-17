// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersCtrl = require('../controllers/users.controller');

module.exports = router;

// получение списка пользоваталей, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), usersCtrl.getUsers);

router.get('/:userId', passport.authenticate('jwt', {session: false}), usersCtrl.getUserDetails);
router.post('/:userId/upload-avatar', passport.authenticate('jwt', {session: false}), usersCtrl.uploadAvatar);
