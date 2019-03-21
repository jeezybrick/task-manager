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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.pre('remove',async function (next) {

  console.log('NoteSchema.pre');

  try {
    // await Card.findOneAndUpdate({_id: this.card}, {$pull: {notes: this._id}});
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Note', NoteSchema);
