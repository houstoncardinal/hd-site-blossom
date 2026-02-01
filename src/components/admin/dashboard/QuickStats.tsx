import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface QuickStatsProps {
  stats: {
    todayAppointments: number;
    pendingAppointments: number;
    totalRevenue: number;
    monthlyGrowth: number;
    avgRating: number;
    totalReviews: number;
    pendingReviews: number;
    totalClients: number;
    newClientsThisMonth: number;
    completedAppointments: number;
  };
  onNavigate: (tab: string) => void;
}

export const QuickStats = ({ stats, onNavigate }: QuickStatsProps) => {
  const statCards = [
    {
      id: 'appointments',
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
      badge: stats.pendingAppointments > 0 ? `${stats.pendingAppointments} pending` : null,
      onClick: () => onNavigate('appointments'),
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500/20 to-green-500/5',
      iconColor: 'text-green-500',
      trend: stats.monthlyGrowth,
      onClick: () => onNavigate('analytics'),
    },
    {
      id: 'rating',
      label: 'Average Rating',
      value: stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)}★` : 'N/A',
      icon: Star,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
      badge: stats.pendingReviews > 0 ? `${stats.pendingReviews} to approve` : null,
      onClick: () => onNavigate('reviews'),
    },
    {
      id: 'clients',
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'from-violet-500/20 to-violet-500/5',
      iconColor: 'text-violet-500',
      badge: stats.newClientsThisMonth > 0 ? `+${stats.newClientsThisMonth} this month` : null,
      onClick: () => onNavigate('clients'),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden relative"
            onClick={stat.onClick}
          >
            {/* Decorative gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full -translate-x-8 -translate-y-8 opacity-50 group-hover:opacity-80 transition-opacity`} />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {stat.trend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{stat.trend >= 0 ? '+' : ''}{stat.trend}%</span>
                    <span className="text-muted-foreground font-normal">vs last month</span>
                  </div>
                )}
                {stat.badge && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
