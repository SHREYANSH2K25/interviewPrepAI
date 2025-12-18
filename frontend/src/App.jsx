import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import LandingPage from './Pages/InterviewPrep/LandingPage';
import Dashboard from './Pages/Home/Dashboard';
import InterviewPrep from './Pages/InterviewPrep/InterviewPrep';
import './App.css';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/:sessionId" element={<InterviewPrep />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
