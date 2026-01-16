import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Admin Dashboard Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* Error Icon */}
            <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>

            {/* Error Message */}
            <div>
              <h1 className="text-2xl font-serif font-light mb-2">Dashboard Error</h1>
              <p className="text-muted-foreground">
                Something went wrong loading the admin dashboard.
              </p>
            </div>

            {/* Technical Details */}
            {this.state.error && (
              <details className="text-left bg-muted/50 rounded-lg overflow-hidden">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                  Show technical details
                </summary>
                <div className="px-4 py-3 border-t border-border">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Error Message:</p>
                      <pre className="text-xs bg-background p-2 rounded overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Stack Trace:</p>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Component Stack:</p>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            )}

            {/* Common Causes */}
            <div className="text-left bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Common causes:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Missing environment variables (check .env file)</li>
                <li>Database connection issues (check Supabase settings)</li>
                <li>RLS policies blocking queries (sign in as admin)</li>
                <li>Missing database tables (run migrations)</li>
              </ul>
              <p className="text-xs text-primary mt-3">
                See ADMIN_DASHBOARD_AUDIT.md for detailed troubleshooting
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              <Button
                onClick={this.handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
