import express from 'express';
const router = express.Router();
import {
  recordConceptAttempt,
  getWeakConcepts,
  getDueForReview,
  getImprovementTrends,
  checkPreviousStruggle
} from '../controllers/mistake.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

// @route   POST /api/mistakes/record
// @desc    Record a concept attempt (mistake or correct answer)
// @access  Private
router.post('/record', authMiddleware, recordConceptAttempt);

// @route   GET /api/mistakes/weak-concepts
// @desc    Get prioritized weak concepts for targeted practice
// @access  Private
router.get('/weak-concepts', authMiddleware, getWeakConcepts);

// @route   GET /api/mistakes/due-for-review
// @desc    Get concepts due for review (spaced repetition)
// @access  Private
router.get('/due-for-review', authMiddleware, getDueForReview);

// @route   GET /api/mistakes/improvement-trends
// @desc    Get improvement trends and mastery distribution
// @access  Private
router.get('/improvement-trends', authMiddleware, getImprovementTrends);

// @route   GET /api/mistakes/check-previous-struggle
// @desc    Check if a question concept was previously struggled with
// @access  Private
router.get('/check-previous-struggle', authMiddleware, checkPreviousStruggle);

export default router;
