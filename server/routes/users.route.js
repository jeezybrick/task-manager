// импорт библиотек и моделей
const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer  = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: 'KNOnkVIArpxYePaNzeVm3Ia8tUtaVlBYXdWAXxHy',
  accessKeyId: 'AKIAJSVFHIBFSST6TUAA',
  // region: 'us-east-1'
});


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../avatars'))
//   },
//   filename: function (req, file, cb) {
//     const filename = req.user._id + '.' + file.originalname.split('.').pop();
//     cb(null, filename)
//   }
// })


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'ionic-public',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const filename = req.user._id + '.' + file.originalname.split('.').pop();
      cb(null, filename);
    }
  })
})

const usersCtrl = require('../controllers/users.controller');

module.exports = router;

// получение списка пользоваталей, метод - GET
router.get('', passport.authenticate('jwt', {session: false}), usersCtrl.getUsers);

router.get('/:userId', passport.authenticate('jwt', {session: false}), usersCtrl.getUserDetails);
router.post('/:userId/upload-avatar', passport.authenticate('jwt', {session: false}), upload.single('avatar'),  usersCtrl.uploadAvatar);
