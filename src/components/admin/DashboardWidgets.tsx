import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

// Dashboard components
import { QuickStats } from './dashboard/QuickStats';
import { SmartInsightsCard } from './dashboard/SmartInsightsCard';
import { RevenueChart } from './dashboard/RevenueChart';
import { ClientGrowthChart } from './dashboard/ClientGrowthChart';
import { ServicePerformance } from './dashboard/ServicePerformance';
import { UpcomingAppointments } from './dashboard/UpcomingAppointments';
import { RecentActivity } from './dashboard/RecentActivity';

interface DashboardWidgetsProps {
  onNavigate: (tab: string) => void;
}

interface DashboardData {
  appointments: any[];
  reviews: any[];
  clients: any[];
  services: any[];
  submissions: any[];
  teamMembers: any[];
}

interface Stats {
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
}

const DashboardWidgets = ({ onNavigate }: DashboardWidgetsProps) => {
  const [data, setData] = useState<DashboardData>({
    appointments: [],
    reviews: [],
    clients: [],
    services: [],
    submissions: [],
    teamMembers: [],
  });
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    avgRating: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalClients: 0,
    newClientsThisMonth: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      const [appointmentsRes, reviewsRes, clientsRes, servicesRes, submissionsRes, teamRes] =
        await Promise.all([
          supabase.from('appointments').select('*').order('created_at', { ascending: false }),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('clients').select('*').order('created_at', { ascending: false }),
          supabase.from('services').select('*').eq('is_active', true),
          supabase.from('form_submissions').select('*').order('created_at', { ascending: false }),
          supabase.from('team_members').select('*').eq('is_active', true),
        ]);

      const appointments = appointmentsRes.data || [];
      const reviews = reviewsRes.data || [];
      const clients = clientsRes.data || [];
      const services = servicesRes.data || [];
      const submissions = submissionsRes.data || [];
      const teamMembers = teamRes.data || [];

      setData({ appointments, reviews, clients, services, submissions, teamMembers });

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter((a) => a.appointment_date === today);
      const pending = appointments.filter((a) => a.status === 'pending' || !a.status);
      const completed = appointments.filter((a) => a.status === 'completed');
      const pendingRevs = reviews.filter((r) => !r.is_approved);
      const avgRating =
        reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      const totalRevenue = completed.reduce((sum, a) => sum + (a.service_price || 0), 0);

      // Monthly growth calculation
      const thisMonthStart = startOfMonth(new Date());
      const thisMonthEnd = endOfMonth(new Date());
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

      const thisMonth = appointments.filter((a) => {
        const date = new Date(a.created_at);
        return date >= thisMonthStart && date <= thisMonthEnd;
      });
      const lastMonth = appointments.filter((a) => {
        const date = new Date(a.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      });
      const growth =
        lastMonth.length > 0
          ? ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100
          : thisMonth.length > 0
          ? 100
          : 0;

      // New clients this month
      const newClientsThisMonth = clients.filter((c) => {
        const date = new Date(c.created_at);
        return date >= thisMonthStart && date <= thisMonthEnd;
      }).length;

      setStats({
        todayAppointments: todayAppts.length,
        pendingAppointments: pending.length,
        totalRevenue,
        monthlyGrowth: Math.round(growth),
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        pendingReviews: pendingRevs.length,
        totalClients: clients.length,
        newClientsThisMonth,
        completedAppointments: completed.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data', {
        description:
          error instanceof Error ? error.message : 'Please check your database connection',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-card rounded-xl border border-border" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-[400px] bg-card rounded-xl border border-border lg:col-span-2" />
          <div className="h-[400px] bg-card rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <QuickStats stats={stats} onNavigate={onNavigate} />

      {/* Main Grid - Charts & Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart appointments={data.appointments} />
        </div>

        {/* Smart Insights */}
        <SmartInsightsCard
          data={{
            appointments: data.appointments,
            clients: data.clients,
            reviews: data.reviews,
            services: data.services,
          }}
        />
      </div>

      {/* Second Row - Performance & Upcoming */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service Performance */}
        <ServicePerformance
          appointments={data.appointments}
          services={data.services}
        />

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <UpcomingAppointments
            appointments={data.appointments}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Third Row - Client Growth & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client Growth */}
        <ClientGrowthChart clients={data.clients} appointments={data.appointments} />

        {/* Recent Activity */}
        <RecentActivity
          appointments={data.appointments}
          reviews={data.reviews}
          clients={data.clients}
          submissions={data.submissions}
          onNavigate={onNavigate}
        />
      </div>
    </motion.div>
  );
};

export default DashboardWidgets;
