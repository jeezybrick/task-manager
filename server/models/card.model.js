const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logTimeSuffixEnum = ['m', 'h'];

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
  loggedTime: [
    {
      date: [{
        type: Date,
        required: true
      }],
      workedValue: {
        type: Number,
        required: true
      },
      workedSuffix: {
        type: String,
        required: true,
        enum: logTimeSuffixEnum,
      },
      estimateValue: {
        type: Number,
        required: true
      },
      estimateSuffix: {
        type: String,
        required: true,
        enum: logTimeSuffixEnum,
      },
    }
  ],
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
