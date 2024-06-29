const Tour = require('./../models/tourModel');
exports.getAllTours = async (req, res) => {
  try {
    //get all tours code Here ...

    //1-A)Filtering: remove unwanted objects from the request query
    //-a-get query request
    const queryObj = { ...req.query }; //here we make a hard copy of the query request
    //-b-create array of excluded fields
    const excluded = ['sort', 'limit', 'page', 'fields'];
    //-c-remove the execluded field from the query copy
    excluded.forEach(el => delete queryObj[el]);

    // 1-B)Filtering;
    //-a-stringify request
    let queryStr = JSON.stringify(queryObj);
    //-b-search for operation and add $ before
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, match => `$${match}`);

    //2)Sorting:
    let query = Tour.find(JSON.parse(queryStr));
    //--check if request contain sort
    if (req.query.sort) {
      //--get sort then remove the camma and put space instead if the request sort on multiple documents
      const sort = req.query.sort.split(',').join(' ');
      query = query.sort(sort);
    } else {
      //if request doesnt want a sort, it will sort accourding to the new inserted tours in descending order (-)
      query = query.sort('-createdAt');
    }
    //--pass query object to the find
    const tours = await query;
    res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
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

exports.getTour = async (req, res) => {
  try {
    //get single tour code Here....
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    //update tour code Here....
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); //new-->return the new updated doc & runValidator validate the new insertion
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    //delete tour code Here....
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
