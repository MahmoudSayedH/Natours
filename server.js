const dotenv = require('dotenv');
dotenv.config(); //add enviroment variables found in the file .env

const mongoose = require('mongoose');
const app = require('./app');

//connecting to database
const db =
  //process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD) ||
  process.env.DATABASE_LOCAL;
mongoose.connect(db).then(() => console.log('connected to db'));

// resolver the unhandled promises
process.on('unhandledRejection', err => {
  console.log(err.name, err.message); //dispkay the error
  //close the server then close the app
  server.close(() => {
    process.exit(1);
  });
});

//Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
