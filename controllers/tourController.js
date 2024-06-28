const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
  if (val * 1 > tours.length) {
    //check if the id valid
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  next();
};

//check the body of the request if it contains the name and price properties
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({ status: 'success', results: tours.length, tours });
};

exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  });
};

exports.getTour = (req, res) => {
  //   console.log(req.params.id);
  const id = req.params.id * 1; //convert id in the params to int
  const tour = tours.find(element => element.id === id); //search for the id in the tours array
  res.status(200).json({ status: 'success', data: { tour } });
};

exports.updateTour = (req, res) => {
  //update tour code Here....

  res.status(200).json({ status: 'success', data: { tour: 'updated tour' } });
};
exports.deleteTour = (req, res) => {
  //delete tour code Here....

  res.status(204).json({ status: 'success', data: null });
};
