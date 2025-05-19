import { useAuth } from './Login'; // or wherever your AuthContext is
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};