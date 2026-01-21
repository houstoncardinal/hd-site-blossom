import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  email: string;
  name: string;
  phone: string | null;
  totalAppointments: number;
  totalSpent: number;
  avgRating: number;
  lastVisit: string | null;
  upcomingAppointments: number;
  appointments: any[];
  reviews: any[];
}

const ClientsManager = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Fetch all appointments
      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (aptError) throw aptError;

      // Fetch all reviews
      const { data: reviews, error: revError } = await supabase
        .from('reviews')
        .select('*');

      if (revError) throw revError;

      // Group by client email
      const clientMap = new Map<string, ClientData>();

      (appointments || []).forEach(apt => {
        const email = apt.client_email.toLowerCase();
        const existing = clientMap.get(email);
        const isUpcoming = new Date(apt.appointment_date) >= new Date();
        const isCompleted = apt.status === 'completed';

        if (existing) {
          existing.totalAppointments++;
          existing.appointments.push(apt);
          if (isCompleted) existing.totalSpent += apt.service_price || 0;
          if (isUpcoming && apt.status !== 'cancelled') existing.upcomingAppointments++;
          if (!existing.lastVisit || apt.appointment_date > existing.lastVisit) {
            if (!isUpcoming) existing.lastVisit = apt.appointment_date;
          }
          // Update name if empty
          if (!existing.name && apt.client_name) existing.name = apt.client_name;
          if (!existing.phone && apt.client_phone) existing.phone = apt.client_phone;
        } else {
          clientMap.set(email, {
            email,
            name: apt.client_name,
            phone: apt.client_phone,
            totalAppointments: 1,
            totalSpent: isCompleted ? (apt.service_price || 0) : 0,
            avgRating: 0,
            lastVisit: isUpcoming ? null : apt.appointment_date,
            upcomingAppointments: (isUpcoming && apt.status !== 'cancelled') ? 1 : 0,
            appointments: [apt],
            reviews: [],
          });
        }
      });

      // Add reviews to clients
      (reviews || []).forEach(review => {
        const email = review.client_email.toLowerCase();
        const client = clientMap.get(email);
        if (client) {
          client.reviews.push(review);
        }
      });

      // Calculate average ratings
      clientMap.forEach(client => {
        if (client.reviews.length > 0) {
          const totalRating = client.reviews.reduce((sum, r) => sum + r.rating, 0);
          client.avgRating = Math.round((totalRating / client.reviews.length) * 10) / 10;
        }
      });

      // Convert to array and sort by total appointments
      const clientList = Array.from(clientMap.values())
        .sort((a, b) => b.totalAppointments - a.totalAppointments);

      setClients(clientList);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone?.includes(query)
    );
  }, [clients, searchQuery]);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    const repeatClients = clients.filter(c => c.totalAppointments > 1).length;
    const avgSpendPerClient = totalClients > 0 ? totalRevenue / totalClients : 0;
    return { totalClients, totalRevenue, repeatClients, avgSpendPerClient };
  }, [clients]);

  const openClientDetails = (client: ClientData) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Users className="h-6 w-6" />
          Client Management
        </h2>
        <Badge variant="secondary">{clients.length} clients</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Repeat Clients</p>
                <p className="text-2xl font-bold">{stats.repeatClients}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Spend</p>
                <p className="text-2xl font-bold">${Math.round(stats.avgSpendPerClient)}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-amber-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Visits</TableHead>
                <TableHead className="text-center">Upcoming</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.email} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.totalAppointments > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              Loyal Client
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{client.totalAppointments}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {client.upcomingAppointments > 0 ? (
                        <Badge className="bg-blue-500">{client.upcomingAppointments}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${client.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {client.avgRating > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span>{client.avgRating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.lastVisit ? (
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(client.lastVisit), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openClientDetails(client)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p>{selectedClient.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedClient.email}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{selectedClient.email}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="font-medium">{selectedClient.phone || 'Not provided'}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{selectedClient.totalAppointments}</p>
                    <p className="text-xs text-muted-foreground">Total Visits</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">${selectedClient.totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{selectedClient.avgRating || '-'}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{selectedClient.upcomingAppointments}</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>

                {/* Appointment History */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointment History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedClient.appointments.slice(0, 10).map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{apt.service_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(apt.appointment_date), 'MMM d, yyyy')} at {apt.appointment_time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              apt.status === 'completed' ? 'secondary' :
                              apt.status === 'confirmed' ? 'default' :
                              apt.status === 'cancelled' ? 'destructive' : 'outline'
                            }
                          >
                            {apt.status || 'pending'}
                          </Badge>
                          <p className="text-sm font-medium mt-1">${apt.service_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                {selectedClient.reviews.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Reviews
                    </h4>
                    <div className="space-y-2">
                      {selectedClient.reviews.map((review) => (
                        <div key={review.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {format(new Date(review.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm">{review.review_text || 'No comment'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ClientsManager;
