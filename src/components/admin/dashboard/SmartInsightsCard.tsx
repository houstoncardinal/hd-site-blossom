import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface InsightData {
  appointments: any[];
  clients: any[];
  reviews: any[];
  services: any[];
}

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'opportunity';
  icon: React.ElementType;
  title: string;
  description: string;
  metric?: string;
  action?: string;
}

export const SmartInsightsCard = ({ data }: { data: InsightData }) => {
  const insights = useMemo(() => {
    const results: Insight[] = [];
    const { appointments, clients, reviews } = data;

    // Calculate metrics
    const completedAppts = appointments.filter(a => a.status === 'completed');
    const pendingAppts = appointments.filter(a => a.status === 'pending' || !a.status);
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // High-value client insight
    if (clients.length > 0) {
      const clientSpending = clients.map(c => ({
        ...c,
        totalSpent: appointments
          .filter(a => a.client_id === c.id && a.status === 'completed')
          .reduce((sum, a) => sum + (a.service_price || 0), 0),
      })).sort((a, b) => b.totalSpent - a.totalSpent);

      const topClient = clientSpending[0];
      if (topClient && topClient.totalSpent > 0) {
        results.push({
          id: 'top-client',
          type: 'success',
          icon: Target,
          title: 'Top Client Identified',
          description: `${topClient.name} has spent $${topClient.totalSpent.toLocaleString()}`,
          metric: `$${topClient.totalSpent}`,
          action: 'Consider VIP perks',
        });
      }
    }

    // Pending appointments alert
    if (pendingAppts.length > 3) {
      results.push({
        id: 'pending-alert',
        type: 'warning',
        icon: AlertTriangle,
        title: 'Attention Required',
        description: `${pendingAppts.length} appointments need confirmation`,
        metric: `${pendingAppts.length} pending`,
        action: 'Review now',
      });
    }

    // Revenue trend
    const thisMonth = completedAppts.filter(a => {
      const date = new Date(a.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const lastMonth = completedAppts.filter(a => {
      const date = new Date(a.created_at);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthRevenue = thisMonth.reduce((sum, a) => sum + (a.service_price || 0), 0);
    const lastMonthRevenue = lastMonth.reduce((sum, a) => sum + (a.service_price || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0 ? 100 : 0;

    if (revenueGrowth > 10) {
      results.push({
        id: 'revenue-growth',
        type: 'success',
        icon: TrendingUp,
        title: 'Revenue Growing',
        description: `Up ${Math.round(revenueGrowth)}% compared to last month`,
        metric: `+${Math.round(revenueGrowth)}%`,
      });
    } else if (revenueGrowth < -10) {
      results.push({
        id: 'revenue-decline',
        type: 'warning',
        icon: TrendingDown,
        title: 'Revenue Declining',
        description: `Down ${Math.abs(Math.round(revenueGrowth))}% from last month`,
        metric: `${Math.round(revenueGrowth)}%`,
        action: 'Run a promotion',
      });
    }

    // Rating insight
    if (avgRating >= 4.5 && reviews.length >= 5) {
      results.push({
        id: 'high-rating',
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Reputation',
        description: `Maintaining ${avgRating.toFixed(1)}/5 star average`,
        metric: `${avgRating.toFixed(1)}★`,
      });
    }

    // Opportunity insight
    const pendingReviews = reviews.filter(r => !r.is_approved);
    if (pendingReviews.length > 0) {
      results.push({
        id: 'pending-reviews',
        type: 'opportunity',
        icon: Lightbulb,
        title: 'Reviews to Approve',
        description: `${pendingReviews.length} reviews waiting for moderation`,
        metric: `${pendingReviews.length} new`,
        action: 'Boost SEO',
      });
    }

    // Booking pattern insight
    if (appointments.length > 10) {
      const dayOfWeekCounts: Record<number, number> = {};
      appointments.forEach(a => {
        const day = new Date(a.appointment_date).getDay();
        dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1;
      });
      const busiestDay = Object.entries(dayOfWeekCounts)
        .sort((a, b) => b[1] - a[1])[0];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      if (busiestDay) {
        results.push({
          id: 'busiest-day',
          type: 'info',
          icon: Clock,
          title: 'Peak Booking Day',
          description: `${days[parseInt(busiestDay[0])]} is your busiest day`,
          metric: `${busiestDay[1]} bookings`,
        });
      }
    }

    return results.slice(0, 4); // Show max 4 insights
  }, [data]);

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-500';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'opportunity':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const getBadgeVariant = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'opportunity':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Collecting data for smart insights...</p>
          <p className="text-xs text-muted-foreground mt-1">Add more appointments and reviews to see AI-powered recommendations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span>AI Insights</span>
          <Badge variant="outline" className="ml-auto text-xs font-normal">
            <Zap className="h-3 w-3 mr-1" />
            {insights.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${getInsightColor(insight.type)}`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm">{insight.title}</p>
                    {insight.metric && (
                      <Badge variant="outline" className={`text-xs ${getBadgeVariant(insight.type)}`}>
                        {insight.metric}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.action && (
                    <p className="text-xs text-primary mt-1 font-medium">{insight.action} →</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInsightsCard;
