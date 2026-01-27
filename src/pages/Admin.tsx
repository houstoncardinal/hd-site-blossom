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
import AnalyticsView from '@/components/admin/AnalyticsView';
import BusinessSettings from '@/components/admin/BusinessSettings';
import { NotificationsView, SettingsView } from '@/components/admin/PlaceholderViews';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { LogOut, ArrowLeft, Menu, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
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

  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount, refreshKey]);

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
        />
      </div>

      {/* Main Content Area */}
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}>
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-serif font-light">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Realtime Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                {isRealtimeConnected ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5" />
                    <span>Offline</span>
                  </>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw size={18} />
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut size={16} />
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
