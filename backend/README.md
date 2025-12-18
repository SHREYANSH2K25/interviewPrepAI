# Backend - Interview Prep AI

Node.js backend API for Interview Prep AI application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (Atlas or local)
- Gemini API key
- Cloudinary account

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Update `.env` with your credentials:
   - MongoDB connection string
   - JWT secret key
   - Gemini API key
   - Cloudinary credentials

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/upload-image` - Upload profile image (protected)

### Sessions
- `POST /api/sessions` - Create new interview session (protected)
- `GET /api/sessions` - Get all sessions (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)

### Questions
- `POST /api/questions/:sessionId` - Add question to session (protected)
- `PATCH /api/questions/:questionId/pin` - Pin/unpin question (protected)
- `PATCH /api/questions/:questionId/notes` - Update question notes (protected)

### AI
- `POST /api/ai/generate-questions` - Generate interview questions (protected)
- `POST /api/ai/explain-concept/:questionId` - Generate concept explanation (protected)

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── auth.controller.js
│   ├── session.controller.js
│   ├── question.controller.js
│   └── ai.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── models/
│   ├── User.js
│   ├── Session.js
│   └── Question.js
├── routes/
│   ├── auth.routes.js
│   ├── session.routes.js
│   ├── question.routes.js
│   └── ai.routes.js
├── utils/
│   ├── cloudinary.js
│   └── gemini.js
├── uploads/               # Temporary file uploads
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
├── server.js             # Entry point
└── package.json
```

## Tech Stack

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Gemini API** - AI-powered Q&A generation
- **Cloudinary** - Image storage
- **Multer** - File uploads
