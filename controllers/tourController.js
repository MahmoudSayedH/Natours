const Tour = require('./../models/tourModel');
exports.getAllTours = (req, res) => {
  //get all tours code Here ...
  res.status(200).json({ status: 'success', results: 'tours.length', tours: 'all tours' });
};

exports.createTour = (req, res) => {
  // create tour Here ...
  res.status(201).json({ status: 'success', data: { tour: 'newTour' } });
};

exports.getTour = (req, res) => {
  //update single tour code Here....
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
