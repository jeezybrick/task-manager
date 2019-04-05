const authErrorMessage = 'Доступ запрещен';

// проверка на пользователя
function checkIsAuthenticated(req, res) {

  if (!req.user) {
    res.status(403).send({message: authErrorMessage});
  }
}

// проверка является ли пользователь владельцем доски/колонки/карточки/заметки и удаляем если да
function isUserOwner(itemOwner, authUser) {

  // сохраняем в переменную ID владельца доски
  const boardOwnerId = itemOwner._id.toString();

  // сохраняем в переменную ID текущего пользователя
  const authUserId = authUser._id.toString();

  // сравниваем ID текущего пользователя и ID владельца доски
  return boardOwnerId === authUserId
}

function getAuthErrorMessage() {
  return authErrorMessage;
}


// экспортируем функции для того,
// чтобы импортировать их и использовать в других файлах, например в роутинге
module.exports = {
  checkIsAuthenticated,
  isUserOwner,
  getAuthErrorMessage
};
