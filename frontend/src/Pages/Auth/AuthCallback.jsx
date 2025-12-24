import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setIsAuthenticated } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');
    const userBase64 = searchParams.get('user');

    if (token && userBase64) {
      try {
        // Decode base64 user data
        const userStr = atob(userBase64);
        const user = JSON.parse(userStr);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update context
        setUser(user);
        setIsAuthenticated(true);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/?error=auth_failed');
      }
    } else {
      navigate('/?error=auth_failed');
    }
  }, [searchParams, navigate, setUser, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
