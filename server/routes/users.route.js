// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage });

const usersCtrl = require('../controllers/users.controller');

module.exports = router;

// получение списка пользоваталей, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), usersCtrl.getUsers);

router.get('/:userId', passport.authenticate('jwt', {session: false}), usersCtrl.getUserDetails);
router.post('/:userId/upload-avatar', passport.authenticate('jwt', {session: false}), upload.single('avatar'),  usersCtrl.uploadAvatar);
