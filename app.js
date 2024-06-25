const express = require('express');
const app = express();
const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Middlewares
app.use(express.json());
//ROUTES
//get all tours rout
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({ status: 'success', results: tours.length, tours });
});
//create new tour
app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
