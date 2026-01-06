import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MessageSquare,
  Bell,
  Settings,
  Mail,
  Smartphone,
  Shield,
  Palette,
  Globe,
  Database,
  Construction,
} from 'lucide-react';

export const MessagesView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Messages
        </h2>
        <Badge variant="outline">Coming Soon</Badge>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Construction className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Messages Feature Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Direct messaging with clients will be available in a future update. 
              Stay tuned for seamless communication with your customers.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const NotificationsView = () => {
  const notifications = [
    { id: 1, type: 'appointment', message: 'New appointment booked for tomorrow', time: '2 hours ago', unread: true },
    { id: 2, type: 'review', message: 'New 5-star review received', time: '5 hours ago', unread: true },
    { id: 3, type: 'system', message: 'System maintenance scheduled', time: '1 day ago', unread: false },
  ];

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
        <Button variant="outline" size="sm">Mark All Read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card 
            key={notif.id}
            className={`cursor-pointer transition-all hover:border-primary/30 ${notif.unread ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  notif.type === 'appointment' ? 'bg-blue-500/10' : 
                  notif.type === 'review' ? 'bg-amber-500/10' : 'bg-muted'
                }`}>
                  {notif.type === 'appointment' ? <Mail className="h-5 w-5 text-blue-500" /> :
                   notif.type === 'review' ? <Bell className="h-5 w-5 text-amber-500" /> :
                   <Settings className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
                {notif.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export const SettingsView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-serif font-light flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Settings
      </h2>

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
              <Switch id="email-notifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifs" className="flex-1">
                <p className="font-medium">SMS Reminders</p>
                <p className="text-sm text-muted-foreground">Send appointment reminders to clients</p>
              </Label>
              <Switch id="sms-notifs" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="review-notifs" className="flex-1">
                <p className="font-medium">Review Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about new reviews</p>
              </Label>
              <Switch id="review-notifs" defaultChecked />
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
              <Switch id="2fa" />
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
              <Switch id="dark-mode" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact" className="flex-1">
                <p className="font-medium">Compact View</p>
                <p className="text-sm text-muted-foreground">Reduce spacing in tables</p>
              </Label>
              <Switch id="compact" />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Business
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
