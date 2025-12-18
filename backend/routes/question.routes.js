import express from 'express';
import { 
  addQuestionToSession, 
  togglePinQuestion,
  updateQuestionNotes 
} from '../controllers/question.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/:sessionId', authMiddleware, addQuestionToSession);
router.patch('/:questionId/pin', authMiddleware, togglePinQuestion);
router.patch('/:questionId/notes', authMiddleware, updateQuestionNotes);

export default router;
