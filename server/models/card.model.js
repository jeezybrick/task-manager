const mongoose = require('mongoose');
const User = require('./user.model');
const Board = require('./board.model');
const Column = require('./column.model');
const Note = require('./note.model');
const Schema = mongoose.Schema;

const CardSchema = Schema({
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  name: {
    type: String,
    required: true
  },
  position: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CardSchema.pre('remove', async function (next) {

  console.log('CardSchema.pre');

  try {
    await Note.remove({card: this._id}).exec();
    await mongoose.model('Column').findOneAndUpdate(
      {_id: this.column},
      {$pull: {cards: {_id: this._id}}});

      next();
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Card', CardSchema);
