const mongoose = require('mongoose');
const Card = require('../models/card.model');
const Schema = mongoose.Schema;

const NoteSchema = Schema({
  card: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  name: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.pre('remove',{ document: true, query: true }, async function (next) {

  console.log('NoteSchema.pre');

  try {
    await mongoose.model('Card').findOneAndUpdate(
      {_id: this.card},
      {$pull: {notes: {_id: this._id}}});

    next();
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Note', NoteSchema);
