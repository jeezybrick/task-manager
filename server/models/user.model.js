const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;
const filePluginLib = require('mongoose-file');
const filePlugin = filePluginLib.filePlugin;
const make_upload_to_model = filePluginLib.make_upload_to_model;

const uploads_base = path.join(__dirname, "uploads");
const uploads = path.join(uploads_base, "u");
const defaultAvatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

const UserSchema = Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    minlength: 2,
    maxlength: 30
  },
  hashedPassword: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    required: false,
    default: defaultAvatarUrl
  },
}, {
  versionKey: false
});

// UserSchema.plugin(filePlugin, {
//   name: "avatar",
//   upload_to: make_upload_to_model(uploads, 'avatars'),
//   relative_to: uploads_base,
//   required: false,
//   default: defaultAvatarUrl,
// });


module.exports = mongoose.model('User', UserSchema);
