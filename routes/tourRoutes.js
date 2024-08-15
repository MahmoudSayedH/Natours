const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  topFiveCheapTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');

const { protect, restrictTo } = require('./../controllers/authController');

const reviewsRouter = require('./reviewRoutes');

router.use('/:tourId/reviews', reviewsRouter);

router.route('/tours-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/top-5-cheap-tours').get(topFiveCheapTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// simple nested route
// const { createReview } = require('./../controllers/reviewController');

// POST /tours/23123/reviews
// GET /tours/23123/reviews
// GET /tours/23123/reviews/3213
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
