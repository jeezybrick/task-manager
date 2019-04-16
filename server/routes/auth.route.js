const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
module.exports = router;

router.post('/register', asyncHandler(async (req, res, next) => {

  if (!req.body.email) {
    return;
  }

  const user = await userCtrl.findByEmail(req.body.email);

  if (user) {
    return res.status(401).send({message: 'Пользователь с таким email уже существует'});
  }
  next();
}), asyncHandler(register), login);


router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (!user) {
      return res.status(401).send({message: 'Неправильный email или пароль'});
    }
    req.user = user;
    next();

  })(req, res, next);
}, login);

router.get('/me', passport.authenticate('jwt', { session: false }), login);

async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next()
}

function login(req, res) {
  let user = req.user;
  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}
