const Tour = require('./../models/tourModel');
const queryBuilder = require('./../util/queryBuilder');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/AppError');
// CRUD OPERATIONS
exports.getAllTours = catchAsync(async (req, res, next) => {
  let tours;
  if (req.query) {
    const finalQuery = new queryBuilder(req.query, Tour).filter().sort().limitFields().paginate();
    tours = await finalQuery.mongooseQuery;
  } else {
    tours = await Tour.find();
  }

  res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body); // creat similar to save but it doesnt need instance of Tour
  if (!tour) return next(new AppError(`There is tour with the id ${id}`), 404);

  res.status(201).json({ status: 'success', data: { tour } }); //send response of the new tour
});

exports.getTour = catchAsync(async (req, res, next) => {
  //get single tour code Here....

  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) return next(new AppError(`There is tour with the id ${id}`), 404);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  //update tour code Here....
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); //new-->return the new updated doc & runValidator validate the new insertion
  if (!tour) return next(new AppError(`There is tour with the id ${id}`), 404);

  res.status(200).json({ status: 'success', data: { tour } });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  //delete tour code Here....
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError(`There is tour with the id ${id}`), 404);
  res.status(204).json({ status: 'success', data: null });
});

exports.monthlyPlan = catchAsync(async (req, res, next) => {
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
});

exports.getStats = catchAsync(async (req, res, next) => {
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
});
exports.alias = (req, res, next) => {
  req.query.sort = 'price,duration';
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage,duration';
  next();
};
