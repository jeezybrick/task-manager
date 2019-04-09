const mongoose = require('mongoose');
const Board = require('../models/board.model');
const Card = require('../models/card.model');
const Schema = mongoose.Schema;

const ColumnSchema = Schema({
  board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// запускается когда удаляется колонка,
// pre - значит перед тем, каке удалить с БД. Еще есть post - это после
ColumnSchema.pre('remove', { document: true, query: true }, async function (next) {

  console.log('Column pre remove');

  try {
    // удаляем дочерние карточки
     await mongoose.model('Card').remove({column: this._id}).exec();

     // удаляем колонку с массивка колонок родительской доски
     await mongoose.model('Board').findOneAndUpdate({_id: this.board}, {$pull: {columns: this._id}});
    next();
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Column', ColumnSchema);
