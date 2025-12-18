import express from 'express';
import { signup, login, getProfile, uploadImage } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

export default router;
