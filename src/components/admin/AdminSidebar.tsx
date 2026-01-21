import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Star,
  Users,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Sparkles,
  Bell,
  ChevronLeft,
  ChevronRight,
  Building2,
  Image,
  UserCircle,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingCount?: number;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'main' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, section: 'main' },
  { id: 'clients', label: 'Clients', icon: UserCircle, section: 'main' },
  { id: 'reviews', label: 'Reviews', icon: Star, section: 'main' },
  { id: 'team', label: 'Team', icon: Users, section: 'main' },
  { id: 'gallery', label: 'Gallery', icon: Image, section: 'business' },
  { id: 'services', label: 'Services', icon: Sparkles, section: 'business' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'business' },
  { id: 'business', label: 'Business', icon: Building2, section: 'settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, section: 'settings' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'settings' },
];

const AdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse, pendingCount = 0 }: AdminSidebarProps) => {
  const mainItems = menuItems.filter(item => item.section === 'main');
  const businessItems = menuItems.filter(item => item.section === 'business');
  const settingsItems = menuItems.filter(item => item.section === 'settings');
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="font-serif text-lg font-medium">Admin</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={cn('shrink-0', collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Main Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Main
            </p>
          )}
          {mainItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 transition-all duration-200 relative',
                collapsed && 'justify-center px-2',
                activeTab === item.id && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.id === 'appointments' && pendingCount > 0 && (
                <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Business Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Business
            </p>
          )}
          {businessItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 transition-all duration-200',
                collapsed && 'justify-center px-2',
                activeTab === item.id && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Settings
            </p>
          )}
          {settingsItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 transition-all duration-200',
                collapsed && 'justify-center px-2',
                activeTab === item.id && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Glamour Studio</p>
            <p>© 2024</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
