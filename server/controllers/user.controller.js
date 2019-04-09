const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');
const utils = require('../shared/utils');
const errorMessage = 'Упс, что то пошло не так :(';
const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password'))
});

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}

// обновление данных заметки с БД
async function updateUser(req, res) {

  // проверка на пользователя
  utils.checkIsAuthenticated(req, res);

  // обновляем данные пользователя
  User.findOneAndUpdate({_id: req.user._id}, req.body, {upsert: false, new: true})
    .exec((err, user) => {
      if (err) {
        res.status(403).send({email: 'Такой email уже существует'});
      }
      // возвращаем обновленного пользователя
      res.json(user);
    });

}

module.exports = {
  insert,
  updateUser
};
