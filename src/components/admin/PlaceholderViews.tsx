import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  Settings,
  Shield,
  Palette,
  Globe,
  Database,
  Calendar,
  Star,
  CheckCircle2,
  Smartphone,
  Loader2,
} from 'lucide-react';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { useUserSettings } from '@/hooks/useUserSettings';

export const NotificationsView = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-amber-500" />;
      default:
        return <Settings className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card 
            key={notif.id}
            className={`cursor-pointer transition-all hover:border-primary/30 ${
              !notif.is_read ? 'border-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => !notif.is_read && markAsRead(notif.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  notif.type === 'appointment' ? 'bg-blue-500/10' : 
                  notif.type === 'review' ? 'bg-amber-500/10' : 'bg-muted'
                }`}>
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notif.created_at)}
                  </p>
                </div>
                {notif.is_read ? (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export const SettingsView = () => {
  const { settings, saving, updateSettings } = useUserSettings();

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handleThemeToggle = (darkMode: boolean) => {
    updateSettings({ theme: darkMode ? 'dark' : 'light' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h2>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifs" className="flex-1">
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive booking confirmations via email</p>
              </Label>
              <Switch 
                id="email-notifs" 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifs" className="flex-1">
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Send push notifications for updates</p>
              </Label>
              <Switch 
                id="sms-notifs" 
                checked={settings.push_notifications}
                onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa" className="flex-1">
                <p className="font-medium">Two-Factor Auth</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </Label>
              <Switch id="2fa" disabled />
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Manage Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme for dashboard</p>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={settings.theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Database className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Business Hours
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Smartphone className="h-4 w-4" />
              Contact Info
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
