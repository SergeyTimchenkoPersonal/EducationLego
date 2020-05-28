const {Schema, model, Types} = require('mongoose')

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  login: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = model('User', userSchema)
