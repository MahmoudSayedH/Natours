const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
  passwordChangedAt: Date,
});

userSchema.methods.isCorrectPassword = async (condidcatePassword, hashPassword) => {
  return bcrypt.compare(condidcatePassword, hashPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimeStamp) {
  console.log(parseInt(this.passwordChangedAt.getTime() / 1000, 10) < JWTTimeStamp);
  if (this.passwordChangedAt) return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimeStamp;

  return false;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
