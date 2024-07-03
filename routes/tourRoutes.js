const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.route('/tours-stats').get(tourController.getStats);
router.route('/monthly-plan/:year').get(tourController.monthlyPlan);
router.route('/top-5-cheap').get(tourController.alias, tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.createTour); //we chain the two functions; its run one after another
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);
module.exports = router;
