const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  user: {
    first_name: String,
    last_name: String,
    email: String
  },
  created: { type: Date, default: Date.now() },
  level: { type: String, default: "user" },
  is_active: {type: Boolean, default: true }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
