import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, getProfile, uploadImage } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}?error=google_auth_failed` }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
    }
  }
);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

export default router;
