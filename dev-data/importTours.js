const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });
const mongoose = require('mongoose');
const Tour = require(`${__dirname}/../models/tourModel`);
const db =
  //process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD) ||
  process.env.DATABASE_LOCAL;
mongoose
  .connect(db)
  .then(con => console.log('DB connection successful'))
  .catch(err => console.error('DB connection error:', err));
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours-simple.json'), 'utf-8'));
console.log(tours);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
