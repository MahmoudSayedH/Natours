const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  setTourIdUserId,
} = require('./../controllers/reviewController');

const { protect, restrictTo } = require('./../controllers/authController');

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourIdUserId, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
