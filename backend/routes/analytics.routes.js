import express from 'express';
const router = express.Router();
import { calculateReadinessScore, getKnowledgeGaps } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

// @route   GET /api/analytics/readiness-score
// @desc    Calculate interview readiness score (0-100)
// @access  Private
router.get('/readiness-score', authMiddleware, calculateReadinessScore);

// @route   GET /api/analytics/knowledge-gaps
// @desc    Get knowledge gap heatmap with topic-wise strengths
// @access  Private
router.get('/knowledge-gaps', authMiddleware, getKnowledgeGaps);

export default router;
