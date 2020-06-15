const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = Schema({
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true}],
  notifiedUsers: [{ type: Schema.Types.ObjectId, ref: 'User', required: false}],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  priority: {
    type: String,
    enum : ['', 'low', 'medium', 'high'],
    default: '',
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  position: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CardSchema.pre('remove', { document: true, query: true }, async function (next) {

  console.log('Card pre remove');

  try {
    mongoose.model('Note').remove({card: this._id}).exec();
    await mongoose.model('Column').findOneAndUpdate(
      {_id: this.column},
      {$pull: {cards: {_id: this._id}}});

      next();
  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Card', CardSchema);
