import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Star,
  Users,
  LayoutDashboard,
  Settings,
  TrendingUp,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }: AdminSidebarProps) => {
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
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
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
