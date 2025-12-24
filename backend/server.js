import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import sessionRoutes from './routes/session.routes.js';
import questionRoutes from './routes/question.routes.js';
import aiRoutes from './routes/ai.routes.js';
import profileRoutes from './routes/profile.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import mistakeRoutes from './routes/mistake.routes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

// --------------------
// CORS
// --------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://interview-prep-ai-git-main-shreyansh-jains-projects-096182b5.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// SESSION (required by passport internals)
// --------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --------------------
// ROUTES
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mistakes', mistakeRoutes);

// --------------------
// HEALTH
// --------------------
app.get('/health', (req, res) => {
  res.json({
    success: true,
    env: process.env.NODE_ENV,
  });
});

// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
