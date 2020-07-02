// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer  = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const s3 = new aws.S3();
const config = require('../config/config');

aws.config.update({
  secretAccessKey: config.aws.secretAccessKey,
  accessKeyId: config.aws.accessKeyId,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'ionic-public',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const filename = req.user._id + '.' + file.originalname.split('.').pop();
      cb(null, 'avatars' + "/" + filename);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
})

const usersCtrl = require('../controllers/users.controller');

module.exports = router;

// получение списка пользоваталей, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), usersCtrl.getUsers);

router.get('/:userId', passport.authenticate('jwt', {session: false}), usersCtrl.getUserDetails);
router.post('/:userId/upload-avatar', passport.authenticate('jwt', {session: false}), upload.single('avatar'),  usersCtrl.uploadAvatar);
