const mongoose = require('mongoose');
const Column = require('../models/column.model');
const Card = require('../models/card.model');
const Note = require('../models/note.model');
const Schema = mongoose.Schema;

const BoardSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

BoardSchema.pre('remove',async function (next) {

  console.log('BoardSchema.pre');

  try {
    const column = await Column.remove({board: this._id}).exec();

  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Board', BoardSchema);
