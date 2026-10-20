import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

// Allowed for the public
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protected Routes
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/Me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

// Restricted To Admins Only
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
