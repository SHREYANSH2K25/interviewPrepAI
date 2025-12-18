import express from 'express';
import { generateQuestions, explainConcept } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/generate-questions', authMiddleware, generateQuestions);
router.post('/explain-concept/:questionId', authMiddleware, explainConcept);

export default router;
