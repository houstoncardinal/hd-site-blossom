import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Trash2, List, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import AppointmentCalendar from './appointments/AppointmentCalendar';
import BulkActionsToolbar from './appointments/BulkActionsToolbar';

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
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === appointments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(appointments.map(a => a.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);

    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .in('id', ids);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointments',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${ids.length} appointments updated to ${status}`,
      });
      setSelectedIds(new Set());
      fetchAppointments();
    }
    setBulkLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} appointments? This cannot be undone.`)) return;
    setBulkLoading(true);

    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from('appointments')
      .delete()
      .in('id', ids);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete appointments',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${ids.length} appointments deleted`,
      });
      setSelectedIds(new Set());
      fetchAppointments();
    }
    setBulkLoading(false);
  };

  const handleBulkSendReminder = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);

    // Simulate sending reminders (in production, this would call an edge function)
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Reminders Sent',
      description: `Reminders sent to ${selectedIds.size} clients`,
    });
    setBulkLoading(false);
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

  const isAllSelected = useMemo(
    () => appointments.length > 0 && selectedIds.size === appointments.length,
    [appointments.length, selectedIds.size]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light">Appointments</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{appointments.length} total</Badge>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
            <TabsList className="h-9">
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="calendar" className="px-3">
                <CalendarIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          onAppointmentClick={(apt) => {
            // Could open a detail modal here
            console.log('Clicked:', apt);
          }}
        />
      ) : (
        <>
          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            onBulkConfirm={() => handleBulkStatusUpdate('confirmed')}
            onBulkComplete={() => handleBulkStatusUpdate('completed')}
            onBulkCancel={() => handleBulkStatusUpdate('cancelled')}
            onBulkSendReminder={handleBulkSendReminder}
            onBulkDelete={handleBulkDelete}
            isLoading={bulkLoading}
          />

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments yet
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow
                      key={apt.id}
                      className={selectedIds.has(apt.id) ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(apt.id)}
                          onCheckedChange={() => handleSelectOne(apt.id)}
                          aria-label={`Select ${apt.client_name}`}
                        />
                      </TableCell>
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
        </>
      )}
    </div>
  );
};

export default AppointmentsManager;
