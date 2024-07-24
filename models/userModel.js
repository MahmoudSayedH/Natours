const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'please provide your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: [8, 'password should be at least 8 characters'],
  },
  photo: String,
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm password'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'password does not match',
    },
  },
});

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;
