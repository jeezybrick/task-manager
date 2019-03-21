const mongoose = require('mongoose');
const Column = require('../models/column.model');
const Note = require('../models/note.model');
const Schema = mongoose.Schema;

const CardSchema = Schema({
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CardSchema.pre('remove',async function (next) {

  console.log('CardSchema.pre');
  console.log(this);

  try {
   /* await Note.remove({card: this._id}).exec();
    await Column.findOneAndUpdate(
      {_id: this.column},
      {$pull: {cards: {_id: this._id}}},
      (err, doc) => {
        console.log(err);
        console.log(doc);
      });*/
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Card', CardSchema);
