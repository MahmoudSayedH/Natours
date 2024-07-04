const Tour = require('./../models/tourModel');
const queryBuilder = require('./../util/queryBuilder');

exports.alias = (req, res, next) => {
  req.query.sort = 'price,duration';
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage,duration';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    let tours;
    if (req.query) {
      const finalQuery = new queryBuilder(req.query, Tour).filter().sort().limitFields().paginate();
      tours = await finalQuery.mongooseQuery;
    } else {
      tours = await Tour.find();
    }

    res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.monthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', //create a document for each value in the startDates(remove the array)
      },
      {
        $match: {
          //get all dates in the inserted year
          startDates: {
            $gte: new Date(`${year}-1-1`), //first day of the year
            $lte: new Date(`${year}-12-31`), //last day of the year
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, //group the results for each month
          count: { $sum: 1 }, //count tours in each month
          names: { $push: '$name' }, //get the tour names
        },
      },
      {
        $addFields: { month: '$_id' }, //add new field displays the month
      },
      {
        $project: { _id: 0 }, //hide unwanted field(_id)
      },
      // {
      //   $limit: 12, //limoit the results get only 12 group this is optional
      // },
      {
        $sort: { count: -1 }, //sort the groups according to the number of tours in each in descending order
      },
    ]);
    res.status(200).json({ status: 'success', results: plan.length, data: { plan } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        //get all tours whose rating Average is greater than or equal 4.5
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        // structur of the response...
        $group: {
          _id: { $toUpper: '$difficulty' }, //group by difficulty and set its text letters to UPPER
          count: { $sum: 1 }, //count the nuber of the tours for each group
          minPrice: { $min: '$price' }, //get the minimum price
          maxPrice: { $max: '$price' }, // get the maximum price
          sumOfPrice: { $sum: '$price' },
        },
      },
      {
        //we can attach $match as mutch as we want
        $match: { _id: { $ne: 'EASY' } }, // remove the easy group
      },
      {
        $sort: {
          sumOfPrice: 1, //sort the groups in ascending order
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { stats } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
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
