const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
const getAllTours = (req, res) => {
  res.status(200).json({ status: 'success', results: tours.length, tours });
};

const createTour = (req, res) => {
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
};

const getTour = (req, res) => {
  //   console.log(req.params.id);
  const id = req.params.id * 1; //convert id in the params to int
  if (id > tours.length) {
    //check if the id valid
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  const tour = tours.find(element => element.id === id); //search for the id in the tours array
  res.status(200).json({ status: 'success', data: { tour } });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1; //convert id in the params to int
  if (id > tours.length) {
    //check if the id valid
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  //update tour code Here....

  res.status(200).json({ status: 'success', data: { tour: 'updated tour' } });
};
const deleteTour = (req, res) => {
  const id = req.params.id * 1; //convert id in the params to int
  if (id > tours.length) {
    //check if the id valid
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  //delete tour code Here....

  res.status(204).json({ status: 'success', data: null });
};

const router = express.Router();
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
module.exports = router;
