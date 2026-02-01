import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Calendar,
  Star,
  UserPlus,
  MessageSquare,
} from 'lucide-react';

interface RecentActivityProps {
  appointments: any[];
  reviews: any[];
  clients: any[];
  submissions: any[];
  onNavigate: (tab: string) => void;
}

interface ActivityItem {
  id: string;
  type: 'appointment' | 'review' | 'client' | 'submission';
  icon: React.ElementType;
  title: string;
  description: string;
  timestamp: Date;
  color: string;
  tab: string;
}

export const RecentActivity = ({
  appointments,
  reviews,
  clients,
  submissions,
  onNavigate,
}: RecentActivityProps) => {
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Recent appointments
    appointments.slice(0, 5).forEach(apt => {
      items.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        icon: Calendar,
        title: 'New Booking',
        description: `${apt.client_name} booked ${apt.service_name}`,
        timestamp: new Date(apt.created_at),
        color: 'text-blue-500 bg-blue-500/10',
        tab: 'appointments',
      });
    });

    // Recent reviews
    reviews.slice(0, 3).forEach(review => {
      items.push({
        id: `rev-${review.id}`,
        type: 'review',
        icon: Star,
        title: `${review.rating}★ Review`,
        description: `${review.client_name} left a ${review.rating}-star review`,
        timestamp: new Date(review.created_at),
        color: 'text-amber-500 bg-amber-500/10',
        tab: 'reviews',
      });
    });

    // Recent clients
    clients.slice(0, 3).forEach(client => {
      items.push({
        id: `cli-${client.id}`,
        type: 'client',
        icon: UserPlus,
        title: 'New Client',
        description: `${client.name} joined your client list`,
        timestamp: new Date(client.created_at),
        color: 'text-violet-500 bg-violet-500/10',
        tab: 'clients',
      });
    });

    // Recent submissions
    submissions.slice(0, 3).forEach(sub => {
      items.push({
        id: `sub-${sub.id}`,
        type: 'submission',
        icon: MessageSquare,
        title: 'Form Submission',
        description: `${sub.name} sent a ${sub.form_type} inquiry`,
        timestamp: new Date(sub.created_at),
        color: 'text-green-500 bg-green-500/10',
        tab: 'submissions',
      });
    });

    // Sort by timestamp and take top 8
    return items
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 8);
  }, [appointments, reviews, clients, submissions]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Live Feed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="py-12 text-center">
            <Activity className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border" />

            <div className="divide-y divide-border/50">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 pl-5 hover:bg-muted/30 transition-colors cursor-pointer group relative"
                  onClick={() => onNavigate(activity.tab)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon with timeline dot */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 relative z-10 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">{activity.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
