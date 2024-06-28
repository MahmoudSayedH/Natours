const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); //add enviroment variables found in the file .env

const app = require('./app');

//Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
