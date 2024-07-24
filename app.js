const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./util/AppError');
const globalError = require('./middlewares/globalErrorMiddleware');
const authRouter = require('./routes/authRouters');
//Middlewares
app.use(express.json());
//check if environment variable is development and run morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`)); //now we can get the static files like html-images... from the browser ex:(127.0.0.1:3000/overview.html)
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalError);
module.exports = app;
