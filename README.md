# 🎯 InterviewPrepAI

An AI-powered interview preparation platform that generates role-specific technical questions and provides intelligent explanations to help you ace your interviews.

🚀 **Live Demo:** [https://interview-prep-ai-psi.vercel.app/](https://interview-prep-ai-psi.vercel.app/)

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

### Intelligence & Content
- 🤖 **AI question lab** – Generate role, experience, and focus-area specific question sets powered by Google Gemini, with instant follow-up prompts.
- 💡 **On-demand concept explainers** – Trigger AI explanations, hints, and study tips per question without leaving the workspace.
- 📝 **Rich markdown answers** – Render formatted answers with code blocks, syntax highlighting, and inline callouts for quick scanning.
- 🎯 **Intelligent evaluation** – AI analyzes your answers, identifies strengths/weaknesses, and provides actionable feedback.

### Study Workflow
- 📚 **Session backlog** – Create unlimited sessions, reorder, and resume drafts with saved context.
- 📌 **Pin + note taking** – Pin tricky prompts, attach personal notes, and highlight key learnings for each question.
- ✍️ **Answer submission** – Write your answers in markdown, submit them for instant AI evaluation.
- 🤖 **AI-powered grading** – Google Gemini evaluates your answers, providing score (0-100), feedback, strengths, and improvement areas.
- 📊 **Readiness score** – Intelligent 0-100 scoring based on accuracy, topic coverage, consistency, and engagement depth.
- 🔥 **Knowledge Gap Heatmap** – Visual topic-wise strength analysis with color-coded performance metrics, radar charts, and drill-down insights.
- 🧠 **Mistake Memory System** – Advanced spaced repetition learning that tracks conceptual mistakes using fingerprints, reintroduces weak concepts intelligently, and shows improvement trends over time.
- 🎯 **Practice / review modes** – Toggle between guided study, streak-driven practice, and stat-heavy review layouts.
- ⏱️ **Productivity tools** – Built-in timer, streak tracker, and accuracy stats keep prep measurable.

### Experience & UI
- 🎨 **Dual-theme design** – Purpose-built light and dark themes, glass surfaces, gradients, and responsive layouts tuned for desktop/tablet/mobile.
- 🧊 **Interactive dashboard** – Role-themed cards, hero metrics, and quick actions for generating or resuming sessions in one click.
- 🪟 **Profile achievements** – Unlockable badges, journey highlights, and recap panels styled for both modes.

### Platform & Security
- 🔐 **JWT authentication** – Secure auth pipeline with bcrypt hashing and protected routes.
- ☁️ **Cloudinary storage** – Managed uploads for avatars and supporting media.
- 📤 **RESTful API** – Modular controllers for auth, sessions, questions, and AI tasks with structured validation.

### Developer Friendly
- ⚙️ **Config-driven setup** – Environment templates, reusable Axios instance, and central API path mapping.
- 🧩 **Componentized React app** – Context providers, Framer Motion animations, Tailwind utility patterns, and Lucide icons.

> Every feature ships with parity across light/dark themes, keyboard-friendly flows, and graceful empty/loading states so the README reflects the production experience.

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** & **Bcrypt** - Authentication and security
- **Google Gemini AI** - Question generation and explanations
- **Cloudinary** - Image storage
- **Multer** - File upload handling

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code block styling

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Google Gemini API key
- Cloudinary account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend root:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
InterviewPrepAI/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── session.controller.js # Session management
│   │   ├── question.controller.js # Question operations
│   │   ├── ai.controller.js      # AI integrations
│   │   └── analytics.controller.js # Readiness score calculation
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── upload.middleware.js  # Multer config
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Session.js            # Session schema
│   │   └── Question.js           # Question schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── session.routes.js
│   │   ├── question.routes.js
│   │   ├── ai.routes.js
│   │   └── analytics.routes.js
│   ├── utils/
│   │   ├── cloudinary.js         # Image upload utilities
│   │   └── gemini.js             # AI utilities
│   ├── server.js                 # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Cards/
    │   │   ├── Inputs/
    │   │   ├── layouts/
    │   │   ├── Loader/
    │   │   ├── KnowledgeGapHeatmap.jsx  # Topic strength visualization
    │   │   ├── Navbar.jsx
    │   │   └── ThemeToggle.jsx
    │   ├── context/
    │   │   └── userContext.jsx   # Global state management
    │   ├── Pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── SignUp.jsx
    │   │   ├── Home/
    │   │   │   └── Dashboard.jsx
    │   │   └── InterviewPrep/
    │   │       ├── LandingPage.jsx
    │   │       └── InterviewPrep.jsx
    │   ├── utils/
    │   │   ├── apiPaths.js       # API endpoints
    │   │   ├── axiosInstance.js  # Axios config
    │   │   └── helper.js
    │   ├── App.jsx               # Router setup
    │   ├── main.jsx              # React entry point
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/upload-image` - Upload profile image (protected)

### Sessions
- `POST /api/sessions` - Create interview session (protected)
- `GET /api/sessions` - Get all user sessions (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)

### Questions
- `POST /api/questions/:sessionId` - Add question to session (protected)
- `PATCH /api/questions/:questionId/pin` - Toggle pin status (protected)
- `PATCH /api/questions/:questionId/notes` - Update question notes (protected)
- `PATCH /api/questions/:questionId/answer` - Submit answer for AI evaluation (protected)

### AI
- `POST /api/ai/generate-questions` - Generate interview questions (protected)
- `POST /api/ai/explain-concept` - Get concept explanation (protected)
- `POST /api/ai/evaluate-answer` - AI-powered answer evaluation (protected)

### Analytics
- `GET /api/analytics/readiness-score` - Calculate interview readiness score (protected)
- `GET /api/analytics/knowledge-gaps` - Get knowledge gap heatmap with topic-wise strengths (protected)

### Mistake Tracking (Spaced Repetition)
- `POST /api/mistakes/record` - Record concept attempt for mistake tracking (protected)
- `GET /api/mistakes/weak-concepts` - Get prioritized weak concepts for targeted practice (protected)
- `GET /api/mistakes/due-for-review` - Get concepts due for review based on spaced repetition (protected)
- `GET /api/mistakes/improvement-trends` - Get improvement trends and mastery distribution (protected)
- `GET /api/mistakes/check-previous-struggle` - Check if concept was previously struggled with (protected)

## 🚀 Usage Flow

1. **Sign Up/Login** - Create an account or login to access the platform
2. **Create Session** - Define your target role, experience level, and focus areas
3. **AI Generation** - System automatically generates 10 relevant interview questions with topics and difficulty levels
4. **Answer Questions** - Write your answers in markdown format for each question
5. **AI Evaluation** - Submit your answer for instant AI-powered grading (score, feedback, strengths, improvements)
6. **View Results** - Get detailed feedback on what you covered well and what you missed
7. **Compare Answers** - View the expected answer alongside your submission
8. **Get AI Explanations** - Click "Explain Concept" for detailed AI-generated explanations
9. **Track Progress** - Your readiness score updates automatically based on AI-evaluated accuracy
10. **Analyze Knowledge Gaps** - View topic-wise strength heatmap to identify weak areas
11. **Drill Down** - Click topics to see detailed statistics, difficulty breakdown, and related focus areas
12. **Review & Improve** - Pin important questions, add notes, and revisit weak areas
13. **Manage Sessions** - View, delete, and organize multiple interview prep sessions

## 🎨 UI Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly dark mode with orange accents
- **Smooth Animations** - Fade-in effects and hover interactions
- **Markdown Rendering** - Beautiful code blocks with syntax highlighting
- **Loading States** - Skeleton loaders and spinners for better UX
- **Empty States** - Helpful messages when no data is available

## 🔐 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected API routes with middleware
- Token stored in localStorage with auto-refresh
- CORS enabled for frontend-backend communication

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Shreyansh**
- GitHub: [@SHREYANSH2K25](https://github.com/SHREYANSH2K25)

## 🙏 Acknowledgments

- Google Gemini AI for powerful question generation
- Cloudinary for image storage solutions
- MongoDB Atlas for database hosting
- React and Vite communities for excellent tools

---

Made with ❤️ and ☕ by Shreyansh