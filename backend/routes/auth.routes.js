import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  signup,
  login,
  getProfile,
  uploadImage,
  verifyOTP,
  resendOTP
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// --------------------
// PUBLIC ROUTES
// --------------------
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// --------------------
// GOOGLE OAUTH (REDIRECT FLOW ONLY)
// --------------------
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
      };

      // Use base64 encoding instead of encodeURIComponent to avoid URL parsing issues
      const userBase64 = Buffer.from(JSON.stringify(user)).toString('base64');
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userBase64}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
  }
);

// --------------------
// PROTECTED ROUTES
// --------------------
router.get('/profile', authMiddleware, getProfile);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

export default router;
