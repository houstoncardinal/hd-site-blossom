import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, adminCheckComplete } = useAuth();
  const navigate = useNavigate();
  
  // Dev bypass - MUST be false in production
  const DEV_BYPASS = true; // TODO: Set to false before production deployment

  useEffect(() => {
    if (DEV_BYPASS) return;
    
    // Wait for both auth loading AND admin check to complete
    if (!loading && adminCheckComplete) {
      if (!user) {
        navigate('/auth?admin=true');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, adminCheckComplete, navigate]);

  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  // Show loading while auth is loading OR admin check is pending
  if (loading || (user && !adminCheckComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verifying access...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
