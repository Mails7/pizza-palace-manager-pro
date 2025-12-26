import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_PATHS = ['/login', '/cardapio-publico'];

const AuthHandler = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && location.pathname === '/login') {
        navigate('/', { replace: true });
      } else if (!isAuthenticated && !PUBLIC_PATHS.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return null;
};

export default AuthHandler;
