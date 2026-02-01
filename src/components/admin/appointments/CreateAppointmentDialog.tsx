import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number | null;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM',
];

export const CreateAppointmentDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateAppointmentDialogProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    date: '',
    time: '',
    notes: '',
    status: 'pending',
  });

  const [useExistingClient, setUseExistingClient] = useState(true);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, clientsRes] = await Promise.all([
        supabase.from('services').select('id, name, price, duration_minutes').eq('is_active', true).order('name'),
        supabase.from('clients').select('id, name, email, phone').order('name'),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (clientsRes.error) throw clientsRes.error;

      setServices(servicesRes.data || []);
      setClients(clientsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services and clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone || '',
      }));
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceId,
        serviceName: service.name,
        servicePrice: service.price,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.serviceName || !formData.date || !formData.time) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        client_name: formData.clientName,
        client_email: formData.clientEmail.toLowerCase(),
        client_phone: formData.clientPhone || null,
        client_id: formData.clientId || null,
        service_name: formData.serviceName,
        service_price: formData.servicePrice,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes || null,
        status: formData.status,
      });

      if (error) throw error;

      toast({ title: 'Appointment created successfully' });
      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      serviceId: '',
      serviceName: '',
      servicePrice: 0,
      date: '',
      time: '',
      notes: '',
      status: 'pending',
    });
    setUseExistingClient(true);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Client Selection Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={useExistingClient ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseExistingClient(true)}
              >
                Existing Client
              </Button>
              <Button
                type="button"
                variant={!useExistingClient ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setUseExistingClient(false);
                  setFormData(prev => ({ ...prev, clientId: '' }));
                }}
              >
                New Client
              </Button>
            </div>

            {/* Client Section */}
            {useExistingClient ? (
              <div className="space-y-2">
                <Label>Select Client *</Label>
                <Select value={formData.clientId} onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Name *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Select Service *</Label>
              <Select value={formData.serviceId} onValueChange={handleServiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Select value={formData.time} onValueChange={(v) => setFormData(prev => ({ ...prev, time: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>

            {/* Price Display */}
            {formData.servicePrice > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Price:</span>
                  <span className="font-semibold">${formData.servicePrice}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Appointment'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};