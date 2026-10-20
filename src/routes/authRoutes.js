import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Allowed for the public
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logOut);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

export default router;