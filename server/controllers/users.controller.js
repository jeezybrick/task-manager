const User = require('../models/user.model');

const errorMessage = 'Упс, что то пошло не так :(';

// получение списка колонок, метод - GET
function getUsers(req, res) {

  // Вытаскиваем с БД список пользователей
  // exec -- exucution -выполнение запроса в БД
  User.find().where('_id').ne(req.user._id).exec( (err, users) => {
    if (err) {
      res.status(404).send({message: errorMessage});
    }
    res.json(users);
  });

}

// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  getUsers,
};

