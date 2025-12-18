import express from 'express';
import { 
  createSession, 
  getAllSessions, 
  getSessionById, 
  deleteSession 
} from '../controllers/session.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/', authMiddleware, createSession);
router.get('/', authMiddleware, getAllSessions);
router.get('/:id', authMiddleware, getSessionById);
router.delete('/:id', authMiddleware, deleteSession);

export default router;
