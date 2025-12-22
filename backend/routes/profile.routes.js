import express from 'express';
import { getProfileStats } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get user profile statistics
router.get('/stats', protect, getProfileStats);

export default router;
