import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

// {mergeParams} allows the router to access tourId from tourRoutes
const router = express.Router({ mergeParams: true });

// Protected Routes
router.use(protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

export default router;
