const mongoose = require('mongoose');
const Column = require('../models/column.model');
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

/*
BoardSchema.virtual('columns', {
  ref: 'Column', // The model to use
  localField: 'name', // Find people where `localField`
  foreignField: 'name', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  options: { sort: { name: -1 } }
});
*/

BoardSchema.pre('remove', async function (next) {

  console.log('BoardSchema.pre');

  try {
    await mongoose.model('Column').remove({board: this._id}).exec();
    next();

  } catch(err) {
     next(err);
  }

});


module.exports = mongoose.model('Board', BoardSchema);
