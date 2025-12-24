import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './Pages/InterviewPrep/LandingPage';
import Dashboard from './Pages/Home/Dashboard';
import InterviewPrep from './Pages/InterviewPrep/InterviewPrep';
import Profile from './Pages/Profile/Profile';
import AuthCallback from './Pages/Auth/AuthCallback';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className="app-shell text-foreground dark:text-foregroundDark">
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
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

