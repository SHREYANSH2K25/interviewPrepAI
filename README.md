# 🎯 InterviewPrepAI

An AI-powered interview preparation platform that generates role-specific technical questions and provides intelligent explanations to help you ace your interviews.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

- 🤖 **AI-Powered Questions** - Generate role-specific interview questions using Google Gemini AI
- 📚 **Session Management** - Organize questions by role, experience level, and focus areas
- 📌 **Pin Important Questions** - Mark and prioritize key questions for quick review
- 💡 **Concept Explanations** - Get detailed AI-generated explanations for any concept
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- 🔒 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- ☁️ **Cloud Storage** - Profile images stored securely on Cloudinary
- 📝 **Markdown Support** - Rich text rendering with syntax highlighting

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
│   │   └── ai.controller.js      # AI integrations
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
│   │   └── ai.routes.js
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
    │   │   └── Loader/
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

### AI
- `POST /api/ai/generate-questions` - Generate interview questions (protected)
- `POST /api/ai/explain-concept` - Get concept explanation (protected)

## 🚀 Usage Flow

1. **Sign Up/Login** - Create an account or login to access the platform
2. **Create Session** - Define your target role, experience level, and focus areas
3. **AI Generation** - System automatically generates 10 relevant interview questions
4. **Study & Practice** - Review questions, expand answers, and pin important ones
5. **Get Explanations** - Click "Explain Concept" for detailed AI-generated explanations
6. **Manage Sessions** - View, delete, and organize multiple interview prep sessions

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