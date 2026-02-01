import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Crown,
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  tags: string[] | null;
  is_vip: boolean | null;
  preferred_contact_method: string | null;
  birthday: string | null;
  referral_source: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientStats {
  totalAppointments: number;
  totalSpent: number;
  lastVisit: string | null;
  upcomingAppointments: number;
}

const emptyClient: Partial<Client> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
  tags: [],
  is_vip: false,
  preferred_contact_method: 'email',
  birthday: '',
  referral_source: '',
};

const ClientsManager = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<Record<string, ClientStats>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVip, setFilterVip] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch appointments for stats
      const { data: appointments } = await supabase
        .from('appointments')
        .select('client_email, service_price, appointment_date, status');

      // Calculate stats per client email
      const statsMap: Record<string, ClientStats> = {};
      
      (clientsData || []).forEach(client => {
        const clientAppointments = (appointments || []).filter(
          apt => apt.client_email?.toLowerCase() === client.email.toLowerCase()
        );
        
        const completed = clientAppointments.filter(a => a.status === 'completed');
        const upcoming = clientAppointments.filter(
          a => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled'
        );
        
        const pastDates = clientAppointments
          .filter(a => new Date(a.appointment_date) < new Date())
          .map(a => a.appointment_date)
          .sort()
          .reverse();

        statsMap[client.id] = {
          totalAppointments: clientAppointments.length,
          totalSpent: completed.reduce((sum, a) => sum + (a.service_price || 0), 0),
          lastVisit: pastDates[0] || null,
          upcomingAppointments: upcoming.length,
        };
      });
      
      setClientStats(statsMap);
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

  const openCreateDialog = () => {
    setEditingClient(emptyClient);
    setTagsInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setTagsInput(client.tags?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const saveClient = async () => {
    if (!editingClient?.name || !editingClient?.email) {
      toast({
        title: 'Missing fields',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const clientData = {
      name: editingClient.name,
      email: editingClient.email.toLowerCase(),
      phone: editingClient.phone || null,
      address: editingClient.address || null,
      city: editingClient.city || null,
      notes: editingClient.notes || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      is_vip: editingClient.is_vip ?? false,
      preferred_contact_method: editingClient.preferred_contact_method || 'email',
      birthday: editingClient.birthday || null,
      referral_source: editingClient.referral_source || null,
    };

    try {
      if (editingClient.id) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id);

        if (error) throw error;
        toast({ title: 'Client updated successfully' });
      } else {
        const { error } = await supabase
          .from('clients')
          .insert(clientData);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: 'Email already exists',
              description: 'A client with this email already exists',
              variant: 'destructive',
            });
            return;
          }
          throw error;
        }
        toast({ title: 'Client created successfully' });
      }

      setIsDialogOpen(false);
      fetchClients();
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save client',
        variant: 'destructive',
      });
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Client deleted' });
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const toggleVip = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ is_vip: !client.is_vip })
        .eq('id', client.id);

      if (error) throw error;
      fetchClients();
    } catch (error) {
      console.error('Error toggling VIP:', error);
      toast({
        title: 'Error',
        description: 'Failed to update VIP status',
        variant: 'destructive',
      });
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = !searchQuery || 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery);
      
      const matchesVip = filterVip === null || client.is_vip === filterVip;
      
      return matchesSearch && matchesVip;
    });
  }, [clients, searchQuery, filterVip]);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const vipClients = clients.filter(c => c.is_vip).length;
    const totalRevenue = Object.values(clientStats).reduce((sum, s) => sum + s.totalSpent, 0);
    const avgSpend = totalClients > 0 ? totalRevenue / totalClients : 0;
    return { totalClients, vipClients, totalRevenue, avgSpend };
  }, [clients, clientStats]);

  const openClientDetails = (client: Client) => {
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
        <Button onClick={openCreateDialog}>
          <Plus size={16} className="mr-2" />
          Add Client
        </Button>
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
                <p className="text-sm text-muted-foreground">VIP Clients</p>
                <p className="text-2xl font-bold">{stats.vipClients}</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-500/20" />
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
                <p className="text-sm text-muted-foreground">Avg. Spend</p>
                <p className="text-2xl font-bold">${Math.round(stats.avgSpend)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterVip === null ? 'all' : filterVip ? 'vip' : 'regular'}
          onValueChange={(v) => setFilterVip(v === 'all' ? null : v === 'vip')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="vip">VIP Only</SelectItem>
            <SelectItem value="regular">Regular Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No clients found</p>
              <p className="text-sm">Add your first client to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Appointments</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const stats = clientStats[client.id] || { totalAppointments: 0, totalSpent: 0, lastVisit: null, upcomingAppointments: 0 };
                  return (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => openClientDetails(client)}>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{client.name}</p>
                              {client.is_vip && (
                                <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            {client.tags && client.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {client.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
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
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="outline">{stats.totalAppointments}</Badge>
                          {stats.upcomingAppointments > 0 && (
                            <Badge className="bg-blue-500">{stats.upcomingAppointments} upcoming</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${stats.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {stats.lastVisit ? (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(stats.lastVisit), 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(client)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleVip(client)}>
                              <Crown size={16} className="mr-2" />
                              {client.is_vip ? 'Remove VIP' : 'Make VIP'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteClient(client.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient?.id ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingClient?.name || ''}
                  onChange={(e) => setEditingClient(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingClient?.email || ''}
                  onChange={(e) => setEditingClient(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingClient?.phone || ''}
                  onChange={(e) => setEditingClient(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={editingClient?.birthday || ''}
                  onChange={(e) => setEditingClient(prev => ({ ...prev, birthday: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editingClient?.address || ''}
                onChange={(e) => setEditingClient(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editingClient?.city || ''}
                  onChange={(e) => setEditingClient(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Preferred Contact</Label>
                <Select
                  value={editingClient?.preferred_contact_method || 'email'}
                  onValueChange={(v) => setEditingClient(prev => ({ ...prev, preferred_contact_method: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text/SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral">Referral Source</Label>
              <Input
                id="referral"
                placeholder="How did they find you?"
                value={editingClient?.referral_source || ''}
                onChange={(e) => setEditingClient(prev => ({ ...prev, referral_source: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="Bridal, VIP, Influencer"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editingClient?.notes || ''}
                onChange={(e) => setEditingClient(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="vip"
                checked={editingClient?.is_vip ?? false}
                onCheckedChange={(checked) => setEditingClient(prev => ({ ...prev, is_vip: checked }))}
              />
              <Label htmlFor="vip" className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                VIP Client
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveClient}>Save Client</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    <div className="flex items-center gap-2">
                      <p>{selectedClient.name}</p>
                      {selectedClient.is_vip && (
                        <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
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
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="font-medium">{selectedClient.phone || 'Not provided'}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </div>
                      <p className="font-medium">
                        {selectedClient.city || selectedClient.address || 'Not provided'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats */}
                {clientStats[selectedClient.id] && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{clientStats[selectedClient.id].totalAppointments}</p>
                      <p className="text-xs text-muted-foreground">Total Visits</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">${clientStats[selectedClient.id].totalSpent}</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{clientStats[selectedClient.id].upcomingAppointments}</p>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">
                        {clientStats[selectedClient.id].lastVisit 
                          ? format(new Date(clientStats[selectedClient.id].lastVisit!), 'MMM d')
                          : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedClient.tags && selectedClient.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedClient.birthday && (
                    <div>
                      <span className="text-muted-foreground">Birthday: </span>
                      <span>{format(new Date(selectedClient.birthday), 'MMMM d')}</span>
                    </div>
                  )}
                  {selectedClient.referral_source && (
                    <div>
                      <span className="text-muted-foreground">Referral: </span>
                      <span>{selectedClient.referral_source}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Preferred Contact: </span>
                    <span className="capitalize">{selectedClient.preferred_contact_method || 'Email'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Client Since: </span>
                    <span>{format(new Date(selectedClient.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => openEditDialog(selectedClient)}>
                    <Edit size={16} className="mr-2" />
                    Edit Client
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ClientsManager;