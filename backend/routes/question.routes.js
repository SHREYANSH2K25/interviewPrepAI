import express from 'express';
import { 
  addQuestionToSession, 
  togglePinQuestion,
  updateQuestionNotes,
  submitAnswer
} from '../controllers/question.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/:sessionId', authMiddleware, addQuestionToSession);
router.patch('/:questionId/pin', authMiddleware, togglePinQuestion);
router.patch('/:questionId/notes', authMiddleware, updateQuestionNotes);
router.patch('/:questionId/answer', authMiddleware, submitAnswer);

export default router;
