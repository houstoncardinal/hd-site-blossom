import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string | null;
  notes: string | null;
  created_at: string;
}

const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch appointments',
        variant: 'destructive',
      });
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Status updated' });
      fetchAppointments();
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete appointment',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Appointment deleted' });
      fetchAppointments();
    }
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status || 'pending'] || 'outline'}>
        {status || 'pending'}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-muted-foreground animate-pulse">Loading appointments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light">Appointments</h2>
        <Badge variant="secondary">{appointments.length} total</Badge>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No appointments yet
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{apt.client_name}</div>
                      <div className="text-sm text-muted-foreground">{apt.client_email}</div>
                      {apt.client_phone && (
                        <div className="text-sm text-muted-foreground">{apt.client_phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{apt.service_name}</div>
                      <div className="text-sm text-muted-foreground">${apt.service_price}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{format(new Date(apt.appointment_date), 'MMM d, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">{apt.appointment_time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={apt.status || 'pending'}
                      onValueChange={(value) => updateStatus(apt.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAppointment(apt.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManager;
