const dotenv = require('dotenv');
dotenv.config(); //add enviroment variables found in the file .env

const mongoose = require('mongoose');
const app = require('./app');

//connecting to database
const db =
  //process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD) ||
  process.env.DATABASE_LOCAL;
mongoose.connect(db).then(() => console.log('connected to db'));

//Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
