const Tour = require('./../models/tourModel');
exports.getAllTours = (req, res) => {
  //get all tours code Here ...
  res.status(200).json({ status: 'success', results: 'tours.length', tours: 'all tours' });
};

exports.createTour = async (req, res) => {
  try {
    // create tour Here ...
    // const tour = new Tour(req.body);
    // tour.save();

    const tour = await Tour.create(req.body); // creat similar to save but it doesnt need instance of Tour
    res.status(201).json({ status: 'success', data: { tour } }); //send response of the new tour
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
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
