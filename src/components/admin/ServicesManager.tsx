import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  category: string;
}

// Default services - in production these would come from the database
const defaultServices: Service[] = [
  { id: '1', name: 'Bridal Makeup', description: 'Complete bridal look with trial session', price: 350, duration: 120, isActive: true, category: 'Bridal' },
  { id: '2', name: 'Special Event Glam', description: 'Perfect for parties and special occasions', price: 150, duration: 60, isActive: true, category: 'Events' },
  { id: '3', name: 'Natural Beauty', description: 'Enhance your natural features', price: 95, duration: 45, isActive: true, category: 'Everyday' },
  { id: '4', name: 'Editorial Look', description: 'High-fashion photoshoot ready', price: 200, duration: 90, isActive: true, category: 'Editorial' },
  { id: '5', name: 'Soft Glam', description: 'Subtle elegance for any occasion', price: 120, duration: 60, isActive: true, category: 'Glam' },
  { id: '6', name: 'HD Airbrush', description: 'Flawless camera-ready finish', price: 175, duration: 75, isActive: true, category: 'Professional' },
];

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const openCreateDialog = () => {
    setEditingService({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      duration: 60,
      isActive: true,
      category: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService({ ...service });
    setIsDialogOpen(true);
  };

  const saveService = () => {
    if (!editingService?.name || !editingService?.price) {
      toast({
        title: 'Missing fields',
        description: 'Name and price are required',
        variant: 'destructive',
      });
      return;
    }

    const existingIndex = services.findIndex(s => s.id === editingService.id);
    if (existingIndex >= 0) {
      const updated = [...services];
      updated[existingIndex] = editingService;
      setServices(updated);
      toast({ title: 'Service updated' });
    } else {
      setServices([...services, editingService]);
      toast({ title: 'Service added' });
    }
    setIsDialogOpen(false);
  };

  const deleteService = (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setServices(services.filter(s => s.id !== id));
    toast({ title: 'Service deleted' });
  };

  const toggleActive = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Services
        </h2>
        <Button onClick={openCreateDialog}>
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${Math.min(...services.map(s => s.price))} - ${Math.max(...services.map(s => s.price))}
                </p>
                <p className="text-sm text-muted-foreground">Price Range</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card 
            key={service.id}
            className={`transition-all ${!service.isActive ? 'opacity-60' : ''}`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {service.category}
                  </Badge>
                </div>
                <Switch
                  checked={service.isActive}
                  onCheckedChange={() => toggleActive(service.id)}
                />
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">${service.price}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
              </div>

              <div className="flex gap-1 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(service)}
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService?.name ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={editingService?.name || ''}
                  onChange={(e) =>
                    setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Bridal, Events"
                  value={editingService?.category || ''}
                  onChange={(e) =>
                    setEditingService(prev => prev ? { ...prev, category: e.target.value } : null)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingService?.description || ''}
                onChange={(e) =>
                  setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingService?.price || 0}
                  onChange={(e) =>
                    setEditingService(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editingService?.duration || 60}
                  onChange={(e) =>
                    setEditingService(prev => prev ? { ...prev, duration: parseInt(e.target.value) || 60 } : null)
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={editingService?.isActive ?? true}
                onCheckedChange={(checked) =>
                  setEditingService(prev => prev ? { ...prev, isActive: checked } : null)
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveService}>Save Service</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServicesManager;
