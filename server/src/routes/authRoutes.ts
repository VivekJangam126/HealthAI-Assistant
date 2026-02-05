import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfileValidation, updateProfile);
router.post('/logout', protect, logout);

export default router;
