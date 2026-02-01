import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardWidgets from '@/components/admin/DashboardWidgets';
import AppointmentsManager from '@/components/admin/AppointmentsManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import TeamManager from '@/components/admin/TeamManager';
import { GalleryManager } from '@/components/admin/gallery/GalleryManager';
import ServicesManager from '@/components/admin/services/ServicesManager';
import ClientsManager from '@/components/admin/clients/ClientsManager';
import FormSubmissionsManager from '@/components/admin/submissions/FormSubmissionsManager';
import AnalyticsView from '@/components/admin/AnalyticsView';
import BusinessSettings from '@/components/admin/BusinessSettings';
import { NotificationsView, SettingsView } from '@/components/admin/PlaceholderViews';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { LogOut, ArrowLeft, Menu, RefreshCw, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [newSubmissionsCount, setNewSubmissionsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const fetchPendingCount = useCallback(async () => {
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .or('status.eq.pending,status.is.null');
    setPendingCount(count || 0);
  }, []);

  const fetchNewSubmissionsCount = useCallback(async () => {
    const { count } = await supabase
      .from('form_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');
    setNewSubmissionsCount(count || 0);
  }, []);

  useEffect(() => {
    fetchPendingCount();
    fetchNewSubmissionsCount();
  }, [fetchPendingCount, fetchNewSubmissionsCount, refreshKey]);

  // Real-time subscriptions
  const { isConnected } = useRealtimeSubscriptions({
    enabled: true,
    onNewAppointment: useCallback(() => {
      setRefreshKey(prev => prev + 1);
      fetchPendingCount();
    }, [fetchPendingCount]),
    onAppointmentUpdate: useCallback(() => {
      setRefreshKey(prev => prev + 1);
      fetchPendingCount();
    }, [fetchPendingCount]),
    onNewReview: useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, []),
    onReviewUpdate: useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, []),
  });

  useEffect(() => {
    setIsRealtimeConnected(isConnected);
  }, [isConnected]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardWidgets key={refreshKey} onNavigate={handleTabChange} />;
      case 'appointments':
        return <AppointmentsManager key={refreshKey} />;
      case 'reviews':
        return <ReviewsManager key={refreshKey} />;
      case 'team':
        return <TeamManager key={refreshKey} />;
      case 'gallery':
        return <GalleryManager key={refreshKey} />;
      case 'services':
        return <ServicesManager key={refreshKey} />;
      case 'clients':
        return <ClientsManager key={refreshKey} />;
      case 'submissions':
        return <FormSubmissionsManager key={refreshKey} />;
      case 'analytics':
        return <AnalyticsView key={refreshKey} />;
      case 'business':
        return <BusinessSettings />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardWidgets key={refreshKey} onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          pendingCount={pendingCount}
          newSubmissionsCount={newSubmissionsCount}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-screen z-40 lg:hidden transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
          pendingCount={pendingCount}
          newSubmissionsCount={newSubmissionsCount}
        />
      </div>

      {/* Main Content Area */}
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}>
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden h-9 w-9"
              >
                <Menu size={18} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground h-9 w-9"
              >
                <ArrowLeft size={18} />
              </Button>
              
              <div className="hidden sm:block h-6 w-px bg-border" />
              
              <div>
                <h1 className="text-lg font-serif font-medium tracking-tight">Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden md:block">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Realtime Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                {isRealtimeConnected ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Offline</span>
                  </>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                className="text-muted-foreground hover:text-foreground h-9 w-9"
              >
                <RefreshCw size={16} />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut} 
                className="gap-2 h-9"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <AdminErrorBoundary>
      <ProtectedRoute>
        <AdminDashboardContent />
      </ProtectedRoute>
    </AdminErrorBoundary>
  );
};

export default Admin;
