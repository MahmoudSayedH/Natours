const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  protect,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
} = require('../controllers/authController');

const { getSingleUser, getMe } = require('../controllers/userController');

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);

router.use(protect);
router.route('/update-password').patch(updatePassword);
router.route('/update-me').patch(updateMe);
router.route('/delete-me').delete(deleteMe);
router.route('/me').get(getMe, getSingleUser);

module.exports = router;
