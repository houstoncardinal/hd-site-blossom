import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Star,
  BarChart3,
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const AnalyticsView = () => {
  const [data, setData] = useState<any>({
    weeklyBookings: [],
    topServices: [],
    revenueByService: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      const appts = appointments || [];

      // Weekly bookings (last 7 days)
      const weeklyBookings = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        const count = appts.filter(a => {
          const created = new Date(a.created_at);
          return created >= dayStart && created <= dayEnd;
        }).length;
        weeklyBookings.push({
          day: format(date, 'EEE'),
          date: format(date, 'MMM d'),
          count,
        });
      }

      // Top services
      const serviceCount: Record<string, number> = {};
      appts.forEach(a => {
        serviceCount[a.service_name] = (serviceCount[a.service_name] || 0) + 1;
      });
      const topServices = Object.entries(serviceCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Revenue by service (completed only)
      const revenueByService: Record<string, number> = {};
      appts
        .filter(a => a.status === 'completed')
        .forEach(a => {
          revenueByService[a.service_name] = (revenueByService[a.service_name] || 0) + a.service_price;
        });
      const topRevenue = Object.entries(revenueByService)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setData({
        weeklyBookings,
        topServices,
        revenueByService: topRevenue,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxBookings = Math.max(...data.weeklyBookings.map((d: any) => d.count), 1);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-64 bg-card rounded-lg border border-border" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 bg-card rounded-lg border border-border" />
          <div className="h-48 bg-card rounded-lg border border-border" />
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
          <TrendingUp className="h-6 w-6" />
          Analytics
        </h2>
        <Badge variant="secondary">Last 7 days</Badge>
      </div>

      {/* Weekly Bookings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {data.weeklyBookings.map((day: any, index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-sm font-medium mb-1">{day.count}</span>
                  <div 
                    className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
                    style={{ 
                      height: `${Math.max((day.count / maxBookings) * 100, 4)}px`,
                      minHeight: '4px',
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{day.day}</p>
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topServices.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topServices.map((service: any, index: number) => (
                  <div key={service.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.count} bookings</p>
                    </div>
                    <Badge variant="outline">{service.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueByService.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No completed appointments yet</p>
            ) : (
              <div className="space-y-3">
                {data.revenueByService.map((service: any, index: number) => (
                  <div key={service.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-sm font-medium text-green-600">
                      ${service.revenue >= 1000 ? `${(service.revenue / 1000).toFixed(1)}k` : service.revenue}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.name}</p>
                    </div>
                    <span className="font-medium text-green-600">${service.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
