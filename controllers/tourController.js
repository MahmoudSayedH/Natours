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
    //--check if request contains sort
    if (req.query.sort) {
      //--get sort then remove the camma and put space instead if the request sort on multiple documents
      const sort = req.query.sort.split(',').join(' ');
      //add the sort to the query
      query = query.sort(sort);
    } else {
      //if request doesnt want a sort, it will sort accourding to the new inserted tours in descending order (-)
      query = query.sort('-createdAt');
    }
    //3)Fields: get a selected fields only
    //--check if request contains fields
    if (req.query.fields) {
      //--remove the comma and add a space instead if the request want multiple fields
      const fields = req.query.fields.split(',').join(' ');
      //--add  fields to the query
      query = query.select(fields);
    } else {
      //-- if the request doesnt have fields then remove the __v from the responsed fields
      query = query.select('-__v');
    }

    // 4) pagination
    //--get page and limit from query
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    //--calculate the number of skipped documents
    const skip = (page - 1) * limit;
    //--add number of skipped documents and limit of documents to the query object
    query = query.skip(skip).limit(limit);
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
