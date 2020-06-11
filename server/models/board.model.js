const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true}],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
  name: {
    type: String,
    required: true,
    maxlength: 40,
    minlength: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// запускается когда удаляется доска,
// pre - значит перед тем, каке удалить с БД. Еще есть post - это после
BoardSchema.pre('remove', async function (next) {

  console.log('Board pre remove');

  try {
    // удаляем дочерние колонки
    await mongoose.model('Column').remove({board: this._id}).exec();
    next();

  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Board', BoardSchema);
