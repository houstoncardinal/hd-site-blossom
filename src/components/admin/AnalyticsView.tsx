import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  Users,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

const COLORS = [
  'hsl(45 80% 50%)',
  'hsl(280 60% 55%)',
  'hsl(200 80% 50%)',
  'hsl(160 60% 45%)',
  'hsl(30 70% 50%)',
];

const AnalyticsView = () => {
  const [data, setData] = useState<{
    appointments: any[];
    reviews: any[];
    clients: any[];
    services: any[];
  }>({ appointments: [], reviews: [], clients: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [appointmentsRes, reviewsRes, clientsRes, servicesRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').eq('is_active', true),
      ]);

      setData({
        appointments: appointmentsRes.data || [],
        reviews: reviewsRes.data || [],
        clients: clientsRes.data || [],
        services: servicesRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const { appointments, reviews, clients } = data;
    const completed = appointments.filter(a => a.status === 'completed');
    const totalRevenue = completed.reduce((sum, a) => sum + (a.service_price || 0), 0);
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // This month vs last month
    const thisMonthStart = startOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const thisMonthAppts = appointments.filter(a => new Date(a.created_at) >= thisMonthStart);
    const lastMonthAppts = appointments.filter(a => {
      const d = new Date(a.created_at);
      return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const thisMonthRevenue = thisMonthAppts.filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.service_price || 0), 0);
    const lastMonthRevenue = lastMonthAppts.filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.service_price || 0), 0);

    const revenueGrowth = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0 ? 100 : 0;

    const bookingGrowth = lastMonthAppts.length > 0
      ? ((thisMonthAppts.length - lastMonthAppts.length) / lastMonthAppts.length) * 100
      : thisMonthAppts.length > 0 ? 100 : 0;

    // Conversion rate (completed / total)
    const conversionRate = appointments.length > 0
      ? (completed.length / appointments.length) * 100
      : 0;

    // Avg booking value
    const avgBookingValue = completed.length > 0
      ? totalRevenue / completed.length
      : 0;

    return {
      totalRevenue,
      avgRating,
      totalBookings: appointments.length,
      completedBookings: completed.length,
      totalClients: clients.length,
      totalReviews: reviews.length,
      revenueGrowth: Math.round(revenueGrowth),
      bookingGrowth: Math.round(bookingGrowth),
      conversionRate: Math.round(conversionRate),
      avgBookingValue: Math.round(avgBookingValue),
      thisMonthRevenue,
      thisMonthBookings: thisMonthAppts.length,
    };
  }, [data]);

  // Revenue trend data
  const revenueTrend = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const interval = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date(),
    });

    return interval.map(date => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const dayAppts = data.appointments.filter(a => {
        const d = new Date(a.created_at);
        return d >= dayStart && d <= dayEnd;
      });
      const revenue = dayAppts
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.service_price || 0), 0);

      return {
        date: format(date, 'MMM d'),
        shortDate: format(date, 'EEE'),
        revenue,
        bookings: dayAppts.length,
      };
    });
  }, [data.appointments, timeRange]);

  // Monthly comparison
  const monthlyComparison = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthAppts = data.appointments.filter(a => {
        const d = new Date(a.created_at);
        return d >= monthStart && d <= monthEnd;
      });
      const revenue = monthAppts
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.service_price || 0), 0);

      return {
        month: format(month, 'MMM'),
        revenue,
        bookings: monthAppts.length,
        completed: monthAppts.filter(a => a.status === 'completed').length,
      };
    });
  }, [data.appointments]);

  // Service breakdown
  const serviceBreakdown = useMemo(() => {
    const counts: Record<string, { bookings: number; revenue: number }> = {};
    data.appointments.forEach(a => {
      if (!counts[a.service_name]) {
        counts[a.service_name] = { bookings: 0, revenue: 0 };
      }
      counts[a.service_name].bookings += 1;
      if (a.status === 'completed') {
        counts[a.service_name].revenue += a.service_price || 0;
      }
    });

    return Object.entries(counts)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [data.appointments]);

  // Day of week analysis
  const dayOfWeekAnalysis = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);

    data.appointments.forEach(a => {
      const day = new Date(a.appointment_date).getDay();
      counts[day] += 1;
    });

    return days.map((day, i) => ({
      day,
      bookings: counts[i],
    }));
  }, [data.appointments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `$${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-xl border border-border" />
          ))}
        </div>
        <div className="h-[400px] bg-card rounded-xl border border-border" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-light flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Business performance insights and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-500">${metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              {metrics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={metrics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{metrics.totalBookings}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              {metrics.bookingGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={metrics.bookingGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                {metrics.bookingGrowth >= 0 ? '+' : ''}{metrics.bookingGrowth}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-violet-500" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                {metrics.completedBookings} of {metrics.totalBookings} completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                <p className="text-2xl font-bold">${metrics.avgBookingValue}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                {metrics.avgRating > 0 ? `${metrics.avgRating.toFixed(1)}★ avg rating` : 'No ratings yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Comparison</TabsTrigger>
          <TabsTrigger value="services">Service Breakdown</TabsTrigger>
          <TabsTrigger value="patterns">Booking Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Trend
                <Badge variant="outline" className="ml-auto">
                  Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey={timeRange === '7d' ? 'shortDate' : 'date'}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      interval={timeRange === '90d' ? 6 : timeRange === '30d' ? 2 : 0}
                    />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Comparison
                <Badge variant="outline" className="ml-auto">Last 6 months</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparison} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="revenue" />
                    <Bar dataKey="bookings" fill="hsl(200 80% 50%)" radius={[4, 4, 0, 0]} name="bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-primary" />
                  <span>Revenue ($)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-blue-500" />
                  <span>Bookings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Services by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="revenue"
                      >
                        {serviceBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceBreakdown.map((service, index) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm font-medium truncate max-w-[200px]">{service.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">${service.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(service.revenue / (serviceBreakdown[0]?.revenue || 1)) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{service.bookings} bookings</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Bookings by Day of Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayOfWeekAnalysis} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium">Peak Day</p>
                  <p className="text-lg font-bold text-primary">
                    {dayOfWeekAnalysis.reduce((max, day) =>
                      day.bookings > max.bookings ? day : max
                    ).day}
                  </p>
                  <p className="text-xs text-muted-foreground">Most popular booking day</p>
                </div>

                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-sm font-medium">Best Performer</p>
                  <p className="text-lg font-bold text-green-500 truncate">
                    {serviceBreakdown[0]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">Highest revenue service</p>
                </div>

                <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <p className="text-sm font-medium">Client Base</p>
                  <p className="text-lg font-bold text-violet-500">
                    {metrics.totalClients} clients
                  </p>
                  <p className="text-xs text-muted-foreground">{metrics.totalReviews} reviews collected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AnalyticsView;
