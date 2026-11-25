import express from 'express';
import * as viewsController from '../controllers/viewsController.js';
import * as bookingController from '../controllers/bookingController.js';
import {
  protect,
  isLoggedIn,
  restrictTo,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  isLoggedIn,
  viewsController.getOverview,
);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/signup', isLoggedIn, viewsController.getSignupForm);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/me', protect, viewsController.getAccount);
router.get('/my-bookings', protect, viewsController.getMyTours);
router.get('/my-reviews', protect, viewsController.getMyReviews);
router.get('/billing', protect, viewsController.getBilling);

router.get(
  '/admin/tours',
  protect,
  restrictTo('admin', 'lead-guide'),
  viewsController.getAdminTours,
);
router.get(
  '/admin/users',
  protect,
  restrictTo('admin'),
  viewsController.getAdminUsers,
);
router.get(
  '/admin/reviews',
  protect,
  restrictTo('admin'),
  viewsController.getAdminReviews,
);
router.get(
  '/admin/bookings',
  protect,
  restrictTo('admin', 'lead-guide'),
  viewsController.getAdminBookings,
);

router.post(
  '/submit-user-data',
  protect,
  viewsController.updateUserData,
);

export default router;
