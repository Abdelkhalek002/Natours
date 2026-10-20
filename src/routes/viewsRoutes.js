import express from 'express';
import * as viewsController from '../controllers/viewsController.js';
import * as bookingController from '../controllers/bookingController.js';
import { protect, isLoggedIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  isLoggedIn,
  viewsController.getOverview,
);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/signup', viewsController.getSignupForm);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/me', protect, viewsController.getAccount);
router.get('/my-bookings', protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  protect,
  viewsController.updateUserData,
);

export default router;
