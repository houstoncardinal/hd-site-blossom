import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServiceForm } from './ServiceForm';
import { useServices } from './hooks/useServices';
import { Paintbrush, Plus, MoreVertical, Edit, Trash2, Search, Eye, EyeOff, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/types/services';
import { formatPrice, formatDuration } from '@/types/services';

export const ServicesManager = () => {
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { services, loading, updateService, deleteService, refetch } = useServices();
  const { toast } = useToast();

  const filteredServices = services.filter((service) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query)
    );
  });

  const handleOpenDialog = (service?: Service) => {
    setEditingService(service || null);
    setServiceDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setServiceDialogOpen(false);
    setEditingService(null);
  };

  const handleToggleActive = async (service: Service) => {
    const success = await updateService(service.id, { is_active: !service.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Service ${service.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (service: Service) => {
    if (
      !confirm(
        `Are you sure you want to delete "${service.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const success = await deleteService(service.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    }
  };

  const categoryGroups = filteredServices.reduce((groups, service) => {
    const category = service.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(service);
    return groups;
  }, {} as Record<string, Service[]>);

  const categoryLabels: Record<string, string> = {
    makeup: 'Makeup Services',
    hair: 'Hair Services',
    combo: 'Makeup & Hair Combos',
    bridal: 'Bridal Services',
    event: 'Event Services',
    bundle: 'Service Bundles',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-light flex items-center gap-2">
            <Paintbrush className="h-6 w-6" />
            Services Manager
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your service offerings and pricing
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{services.length} total</Badge>
          <Badge variant="default">
            {services.filter((s) => s.is_active).length} active
          </Badge>
        </div>
      </div>

      {/* Services by Category */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Paintbrush size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No services found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first service to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenDialog()}>
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categoryGroups).map(([category, categoryServices]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{categoryLabels[category] || category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Service Image */}
                      {service.image_url && (
                        <div className="w-full h-40 overflow-hidden bg-muted">
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{service.name}</h4>
                            <p className="text-xs text-muted-foreground">/{service.slug}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!service.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDialog(service)}>
                                  <Edit size={16} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(service)}>
                                  {service.is_active ? (
                                    <>
                                      <EyeOff size={16} className="mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye size={16} className="mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(service)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Description */}
                      {service.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      {/* Pricing and Duration */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-muted-foreground" />
                          <span className="font-medium">{formatPrice(service.base_price)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-muted-foreground" />
                          <span>{formatDuration(service.duration_minutes)}</span>
                        </div>
                      </div>

                        {/* Deposit */}
                        {service.deposit_percentage && service.deposit_percentage > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {service.deposit_percentage}% deposit required
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Form Dialog */}
      <ServiceForm
        open={serviceDialogOpen}
        onClose={handleCloseDialog}
        service={editingService}
        onSuccess={refetch}
      />
    </motion.div>
  );
};

export default ServicesManager;
