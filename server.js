const dotenv = require('dotenv');
dotenv.config(); //add enviroment variables found in the file .env

const mongoose = require('mongoose');
const app = require('./app');

//connecting to database
const db =
  process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD) ||
  process.env.DATABASE_LOCAL;
mongoose.connect(db).then(() => console.log('connected to db'));

//create schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//create model
const Tour = mongoose.model('Tour', tourSchema);

//test the model
const testTour = new Tour({ name: 'test tour', price: 500 });
testTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log(err));
//Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
