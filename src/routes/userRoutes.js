import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes after this middleware require authentication
router.use(protect);

// Password update for authenticated user
router.patch('/updateMyPassword', authController.updatePassword);

// Current user profile resource (Read, Update, Deactivate)
router
  .route('/me')
  .get(userController.getMe, userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  )
  .delete(userController.deleteMe);

// Restrict all remaining endpoints to Admins only
router.use(restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
