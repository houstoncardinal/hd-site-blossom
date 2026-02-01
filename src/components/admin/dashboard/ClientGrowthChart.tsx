import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { Users, UserPlus, TrendingUp } from 'lucide-react';

interface ClientGrowthChartProps {
  clients: any[];
  appointments: any[];
}

export const ClientGrowthChart = ({ clients, appointments }: ClientGrowthChartProps) => {
  const chartData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    let cumulativeClients = 0;

    return last6Months.map(date => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const newClients = clients.filter(c => {
        const created = new Date(c.created_at);
        return created >= monthStart && created <= monthEnd;
      }).length;

      cumulativeClients += newClients;

      const monthAppointments = appointments.filter(a => {
        const created = new Date(a.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      // Unique clients who booked
      const uniqueBookingClients = new Set(monthAppointments.map(a => a.client_email)).size;

      return {
        month: format(date, 'MMM'),
        newClients,
        totalClients: cumulativeClients,
        activeClients: uniqueBookingClients,
      };
    });
  }, [clients, appointments]);

  const totalClients = clients.length;
  const thisMonthNew = chartData[chartData.length - 1]?.newClients || 0;
  const lastMonthNew = chartData[chartData.length - 2]?.newClients || 0;
  const growth = lastMonthNew > 0
    ? ((thisMonthNew - lastMonthNew) / lastMonthNew) * 100
    : thisMonthNew > 0 ? 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
          <p className="text-xs text-muted-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-muted-foreground">New</span>
              <span className="text-sm font-medium">{payload[0]?.value || 0}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-xs text-muted-foreground">Active</span>
              <span className="text-sm font-medium">{payload[1]?.value || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center">
              <Users className="h-4 w-4 text-violet-500" />
            </div>
            Client Growth
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Last 6 months
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-violet-500">{totalClients}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-center gap-1">
              <UserPlus className="h-4 w-4 text-green-500" />
              <p className="text-2xl font-bold">{thisMonthNew}</p>
            </div>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className={`h-4 w-4 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-2xl font-bold ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growth >= 0 ? '+' : ''}{Math.round(growth)}%
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Growth</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="newClients"
                stroke="hsl(280 60% 60%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(280 60% 60%)', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="activeClients"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded bg-violet-500" />
            <span>New Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded bg-primary border-dashed border border-primary" />
            <span>Active Clients</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
