const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

module.exports = app;
