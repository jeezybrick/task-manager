const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
module.exports = router;

// регистрация нового пользователя
router.post('/register', asyncHandler(async (req, res, next) => {

  // если нет email в теле запроса - прерываем функцию
  if (!req.body.email) {
    return;
  }

  // проверяем есть ли уже пользователь с таким email
  const user = await userCtrl.findByEmail(req.body.email);


  if (user) {
    return res.status(401).send({message: 'Користувач с таким email вже існує'});
  }

  next();
}), asyncHandler(register), login);

// авторизация пользователя
router.post('/login', (req, res, next) => {

  passport.authenticate('local', {session: false}, (err, user, info) => {
    // если нет такого пользователя - возвращаем ошибку
    if (!user) {
      return res.status(404).send({message: 'Невірний email або пароль'});
    }
    req.user = user;
    next();

  })(req, res, next);
}, login);

router.get('/me', passport.authenticate('jwt', { session: false }), login);

async function register(req, res, next) {
  // сохраняем пользователя в БД
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next()
}

function login(req, res) {
  let user = req.user;
  // генеририем токен для пользователя
  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}
