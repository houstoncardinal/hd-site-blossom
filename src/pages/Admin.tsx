import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AppointmentsManager from '@/components/admin/AppointmentsManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import TeamManager from '@/components/admin/TeamManager';
import { LogOut, Calendar, Star, Users, ArrowLeft } from 'lucide-react';

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-serif font-light">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar size={16} />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star size={16} />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users size={16} />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentsManager />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsManager />
            </TabsContent>

            <TabsContent value="team">
              <TeamManager />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default Admin;
