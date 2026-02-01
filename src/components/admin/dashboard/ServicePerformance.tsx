import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Sparkles, Crown } from 'lucide-react';

interface ServicePerformanceProps {
  appointments: any[];
  services: any[];
}

interface ServiceStats {
  name: string;
  bookings: number;
  revenue: number;
  percentage: number;
  avgPrice: number;
}

const COLORS = [
  'hsl(45 80% 50%)',    // Gold - primary
  'hsl(280 60% 55%)',   // Purple
  'hsl(200 80% 50%)',   // Blue
  'hsl(160 60% 45%)',   // Green
  'hsl(30 70% 50%)',    // Orange
  'hsl(350 70% 55%)',   // Rose
];

export const ServicePerformance = ({ appointments, services }: ServicePerformanceProps) => {
  const serviceStats = useMemo(() => {
    const stats: Record<string, { bookings: number; revenue: number }> = {};

    appointments.forEach(apt => {
      const serviceName = apt.service_name;
      if (!stats[serviceName]) {
        stats[serviceName] = { bookings: 0, revenue: 0 };
      }
      stats[serviceName].bookings += 1;
      if (apt.status === 'completed') {
        stats[serviceName].revenue += apt.service_price || 0;
      }
    });

    const totalBookings = Object.values(stats).reduce((sum, s) => sum + s.bookings, 0);

    const result: ServiceStats[] = Object.entries(stats)
      .map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue,
        percentage: totalBookings > 0 ? (data.bookings / totalBookings) * 100 : 0,
        avgPrice: data.bookings > 0 ? data.revenue / data.bookings : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return result;
  }, [appointments]);

  const topService = serviceStats[0];
  const totalRevenue = serviceStats.reduce((sum, s) => sum + s.revenue, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.bookings} bookings</p>
          <p className="text-xs text-green-500">${data.revenue.toLocaleString()} revenue</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          Service Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceStats.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="bookings"
                >
                  {serviceStats.slice(0, 5).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 flex flex-col justify-center">
            {serviceStats.slice(0, 4).map((service, index) => (
              <div key={service.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs truncate flex-1">{service.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(service.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performer */}
        {topService && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Top Performing Service</p>
                <p className="font-medium">{topService.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-500">${topService.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{topService.bookings} bookings</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Service List */}
        <div className="mt-4 space-y-3">
          {serviceStats.slice(0, 3).map((service, index) => (
            <div key={service.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{service.name}</span>
                <span className="text-muted-foreground ml-2">${service.revenue.toLocaleString()}</span>
              </div>
              <Progress
                value={totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0}
                className="h-1.5"
                style={{
                  ['--progress-background' as any]: COLORS[index % COLORS.length],
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicePerformance;
