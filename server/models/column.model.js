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

ColumnSchema.pre('remove',async function (next) {
  console.log('ColumnSchema.pre');

  try {
   /* await Card.remove({column: this._id}).exec();
    await Board.findOneAndUpdate({_id: this.board}, {$pull: {columns: this._id}});*/
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Column', ColumnSchema);
