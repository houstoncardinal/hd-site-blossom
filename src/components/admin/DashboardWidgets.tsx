import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Calendar,
  Star,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DashboardWidgetsProps {
  onNavigate: (tab: string) => void;
}

interface Stats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  totalReviews: number;
  pendingReviews: number;
  avgRating: number;
  totalRevenue: number;
  teamMembers: number;
  monthlyGrowth: number;
}

const DashboardWidgets = ({ onNavigate }: DashboardWidgetsProps) => {
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0,
    totalReviews: 0,
    pendingReviews: 0,
    avgRating: 0,
    totalRevenue: 0,
    teamMembers: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch team members
      const { data: team } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);

      const appts = appointments || [];
      const revs = reviews || [];
      const members = team || [];

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appts.filter(a => a.appointment_date === today);
      const pending = appts.filter(a => a.status === 'pending' || !a.status);
      const confirmed = appts.filter(a => a.status === 'confirmed');
      const completed = appts.filter(a => a.status === 'completed');
      const pendingRevs = revs.filter(r => !r.is_approved);
      const avgRating = revs.length > 0 
        ? revs.reduce((sum, r) => sum + r.rating, 0) / revs.length 
        : 0;
      const totalRevenue = completed.reduce((sum, a) => sum + (a.service_price || 0), 0);

      // Monthly growth calculation
      const thisMonth = appts.filter(a => {
        const date = new Date(a.created_at);
        return date >= startOfMonth(new Date()) && date <= endOfMonth(new Date());
      });
      const lastMonth = appts.filter(a => {
        const date = new Date(a.created_at);
        const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
        const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
        return date >= lastMonthStart && date <= lastMonthEnd;
      });
      const growth = lastMonth.length > 0 
        ? ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100 
        : thisMonth.length > 0 ? 100 : 0;

      setStats({
        totalAppointments: appts.length,
        pendingAppointments: pending.length,
        confirmedAppointments: confirmed.length,
        completedAppointments: completed.length,
        todayAppointments: todayAppts.length,
        totalReviews: revs.length,
        pendingReviews: pendingRevs.length,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRevenue,
        teamMembers: members.length,
        monthlyGrowth: Math.round(growth),
      });

      setRecentAppointments(appts.slice(0, 5));
      setRecentReviews(revs.slice(0, 3));
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data', {
        description: error instanceof Error ? error.message : 'Please check your database connection and permissions',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-card rounded-lg border border-border" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Appointments */}
        <motion.div variants={itemVariants}>
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            onClick={() => onNavigate('appointments')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-3xl font-bold mt-1">{stats.todayAppointments}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {stats.pendingAppointments} pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Revenue */}
        <motion.div variants={itemVariants}>
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            onClick={() => onNavigate('appointments')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (Completed)</p>
                  <p className="text-3xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                {stats.monthlyGrowth >= 0 ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">{stats.monthlyGrowth}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">{Math.abs(stats.monthlyGrowth)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Rating */}
        <motion.div variants={itemVariants}>
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            onClick={() => onNavigate('reviews')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{stats.avgRating || '-'}</p>
                    <Star className="h-5 w-5 fill-primary text-primary" />
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {stats.totalReviews} reviews
                </Badge>
                {stats.pendingReviews > 0 && (
                  <Badge variant="secondary" className="text-xs bg-primary/10">
                    {stats.pendingReviews} pending
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members */}
        <motion.div variants={itemVariants}>
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            onClick={() => onNavigate('team')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-3xl font-bold mt-1">{stats.teamMembers}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-violet-500" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Active artists</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row - Appointment Stats & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Appointment Breakdown */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-medium">{stats.pendingAppointments}</span>
                </div>
                <Progress 
                  value={stats.totalAppointments > 0 ? (stats.pendingAppointments / stats.totalAppointments) * 100 : 0} 
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm">Confirmed</span>
                  </div>
                  <span className="font-medium">{stats.confirmedAppointments}</span>
                </div>
                <Progress 
                  value={stats.totalAppointments > 0 ? (stats.confirmedAppointments / stats.totalAppointments) * 100 : 0} 
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-medium">{stats.completedAppointments}</span>
                </div>
                <Progress 
                  value={stats.totalAppointments > 0 ? (stats.completedAppointments / stats.totalAppointments) * 100 : 0} 
                  className="h-2 bg-muted"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => onNavigate('appointments')}
              >
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Appointments */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Appointments
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('appointments')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments yet
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => onNavigate('appointments')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {apt.client_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{apt.client_name}</p>
                          <p className="text-xs text-muted-foreground">{apt.service_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{format(new Date(apt.appointment_date), 'MMM d')}</p>
                        <p className="text-xs text-muted-foreground">{apt.appointment_time}</p>
                      </div>
                      <Badge 
                        variant={apt.status === 'confirmed' ? 'default' : apt.status === 'completed' ? 'secondary' : 'outline'}
                        className="ml-2"
                      >
                        {apt.status || 'pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Third Row - Reviews & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Reviews */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('reviews')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentReviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div 
                      key={review.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
                      onClick={() => onNavigate('reviews')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{review.client_name}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant={review.is_approved ? 'default' : 'outline'} className="text-xs">
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      {review.review_text && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => onNavigate('appointments')}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Manage Appointments</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => onNavigate('reviews')}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Approve Reviews</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => onNavigate('team')}
                >
                  <Users className="h-5 w-5" />
                  <span>Edit Team</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => onNavigate('analytics')}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>View Analytics</span>
                </Button>
              </div>

              {/* Alerts */}
              <div className="mt-6 space-y-3">
                {stats.pendingAppointments > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pending Appointments</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.pendingAppointments} appointment{stats.pendingAppointments !== 1 ? 's' : ''} waiting for confirmation
                      </p>
                    </div>
                  </div>
                )}

                {stats.pendingReviews > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Eye className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reviews Need Approval</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.pendingReviews} review{stats.pendingReviews !== 1 ? 's' : ''} pending moderation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardWidgets;
