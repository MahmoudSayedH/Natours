const AppError = require('./../util/AppError');

const handleCasteErrorDB = err => new AppError(`Invalid ${err.path}: ${err.value}`, 404);
const handleDuplicateFieldsDB = err => new AppError(`${Object.values(err.keyValue)[0]} already exist`, 404);
const handleValidationErrorDB = err => {
  const message = Object.values(err.errors).map(el => {
    return { [el.path]: el.message };
  });
  return new AppError(JSON.stringify(message), 404);
};

const sendErrorDev = (err, res) => {
  console.error(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Some thing went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };
    if (error.name === 'CastError') error = handleCasteErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
