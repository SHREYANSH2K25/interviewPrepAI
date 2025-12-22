import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { signup, login, getProfile, uploadImage, verifyOTP, resendOTP } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import User from '../models/User.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

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

// Google Sign-In with credential (for frontend Google button)
router.post('/google/callback', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google credential
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId, email_verified } = payload;

    // Only allow verified Google emails
    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please use a verified Google account',
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update Google info if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profileImage = picture;
        await user.save();
      }
    } else {
      // Create new user with verified Google account
      user = await User.create({
        googleId,
        name,
        email,
        profileImage: picture,
        isEmailVerified: true, // Google emails are already verified
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed. Please try again.',
    });
  }
});

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

export default router;
