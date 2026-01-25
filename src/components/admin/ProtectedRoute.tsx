import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, adminCheckComplete, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth loading to complete
    if (loading) return;

    // Don't redirect if there's a connection error - show the error instead
    if (error) return;

    // If no user, redirect to login immediately (no need to wait for admin check)
    if (!user) {
      navigate('/auth?admin=true');
      return;
    }

    // If user exists, wait for admin check to complete before redirecting non-admins
    if (adminCheckComplete && !isAdmin) {
      navigate('/');
    }
  }, [user, loading, isAdmin, adminCheckComplete, error, navigate]);

  // Show loading while auth is loading OR admin check is pending
  if (loading || (user && !adminCheckComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verifying access...</div>
      </div>
    );
  }

  // Show error state if there's a connection problem
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <div className="text-destructive mb-4 text-lg font-medium">Connection Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-left">
            <p className="font-medium mb-2">Common fixes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your Supabase URL and anon key in .env</li>
              <li>Ensure the database migration has been run</li>
              <li>Verify your internet connection</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show redirecting state while navigation happens
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground mb-2">
            {!user ? 'Redirecting to login...' : 'Access denied'}
          </div>
          {!user && (
            <p className="text-sm text-muted-foreground">
              Please sign in to access the admin dashboard.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
