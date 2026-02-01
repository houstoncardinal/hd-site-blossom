import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  MessageSquare,
  Zap,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingCount?: number;
  newSubmissionsCount?: number;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'main' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, section: 'main' },
  { id: 'submissions', label: 'Form Submissions', icon: MessageSquare, section: 'main' },
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

const AdminSidebar = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  pendingCount = 0,
  newSubmissionsCount = 0,
}: AdminSidebarProps) => {
  const mainItems = menuItems.filter((item) => item.section === 'main');
  const businessItems = menuItems.filter((item) => item.section === 'business');
  const settingsItems = menuItems.filter((item) => item.section === 'settings');

  const renderMenuItem = (item: (typeof menuItems)[0]) => {
    const isActive = activeTab === item.id;
    const hasBadge =
      (item.id === 'appointments' && pendingCount > 0) ||
      (item.id === 'submissions' && newSubmissionsCount > 0);
    const badgeCount = item.id === 'appointments' ? pendingCount : newSubmissionsCount;
    const badgeColor = item.id === 'appointments' ? 'bg-amber-500' : 'bg-blue-500';

    const button = (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 transition-all duration-200 relative group',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-primary/10 text-primary hover:bg-primary/15 font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        onClick={() => onTabChange(item.id)}
      >
        {/* Active indicator */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
        )}

        <item.icon
          size={18}
          className={cn('shrink-0 transition-colors', isActive && 'text-primary')}
        />

        {!collapsed && <span className="truncate">{item.label}</span>}

        {hasBadge && (
          <Badge
            className={cn(
              'h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-medium text-primary-foreground',
              collapsed ? 'absolute -top-1 -right-1' : 'ml-auto',
              badgeColor
            )}
          >
            {badgeCount > 9 ? '9+' : badgeCount}
          </Badge>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider key={item.id} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.label}
              {hasBadge && (
                <Badge className={cn('h-5 px-1.5 text-xs', badgeColor)}>
                  {badgeCount}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card/95 backdrop-blur-sm border-r border-border z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium tracking-tight">HDA Studio</h2>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={cn(
            'shrink-0 h-8 w-8 hover:bg-muted/50',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-6">
          {/* Main Section */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Main
              </p>
            )}
            {mainItems.map(renderMenuItem)}
          </div>

          {/* Business Section */}
          <div className="space-y-1">
            {!collapsed && (
              <>
                <Separator className="my-3 opacity-50" />
                <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Business
                </p>
              </>
            )}
            {collapsed && <Separator className="my-3 opacity-50" />}
            {businessItems.map(renderMenuItem)}
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            {!collapsed && (
              <>
                <Separator className="my-3 opacity-50" />
                <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Settings
                </p>
              </>
            )}
            {collapsed && <Separator className="my-3 opacity-50" />}
            {settingsItems.map(renderMenuItem)}
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">HDA Studio</p>
              <p className="text-[10px] text-muted-foreground">Professional Dashboard</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
