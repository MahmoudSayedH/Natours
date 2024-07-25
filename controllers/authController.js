const catchAsync = require('../util/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../util/AppError');

const signupJWT = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_IN });
};

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signupJWT(user._id);
  res.status(201).json({ status: 'success', token, data: { user } });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password are valid
  if (!email || !password) return next(new AppError('please provide valid email or password', 400));
  //get the password of the email if found
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // if(!user || await bcrypt.)
  const token = signupJWT(user._id);
  res.status(200).json({ status: 'success', token });
});

const protect = catchAsync(async (req, res, next) => {
  //check if the token found in the request headers and start with bearer
  let token;
  if (req.headers.authorization && req.headers.authorization.startswith('bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in, please login to get access '), 401);
  }

  next();
});
module.exports = { signup, login, protect };
