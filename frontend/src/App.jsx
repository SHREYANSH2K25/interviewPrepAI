import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/userContext';
import LandingPage from './Pages/InterviewPrep/LandingPage';
import Dashboard from './Pages/Home/Dashboard';
import InterviewPrep from './Pages/InterviewPrep/InterviewPrep';
import AuthCallback from './Pages/Auth/AuthCallback';
import Profile from './Pages/Profile/Profile';
import './App.css';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/interview/:sessionId" element={<InterviewPrep />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

