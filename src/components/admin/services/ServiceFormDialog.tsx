import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, DollarSign, Clock, Star, Tag } from 'lucide-react';
import { Service, ServiceFormData, ServiceCategory } from './hooks/useServicesData';

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  categories: ServiceCategory[];
  defaultFormData: ServiceFormData;
  saving: boolean;
  onSave: (formData: ServiceFormData) => Promise<boolean>;
}

const ServiceFormDialog = ({
  open,
  onOpenChange,
  service,
  categories,
  defaultFormData,
  saving,
  onSave,
}: ServiceFormDialogProps) => {
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);
  const [newInclude, setNewInclude] = useState('');
  const [newEventType, setNewEventType] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        price: service.price,
        original_price: service.original_price,
        deposit: service.deposit,
        duration: service.duration || '60 min',
        duration_minutes: service.duration_minutes || 60,
        image_url: service.image_url || '',
        category: service.category,
        includes: service.includes || [],
        is_active: service.is_active,
        is_popular: service.is_popular,
        display_order: service.display_order,
        stripe_price_id: service.stripe_price_id || '',
        event_types: service.event_types || [],
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [service, defaultFormData]);

  const handleSubmit = async () => {
    if (!formData.name || formData.price <= 0) return;
    
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()],
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  const addEventType = () => {
    if (newEventType.trim() && !formData.event_types.includes(newEventType.trim())) {
      setFormData(prev => ({
        ...prev,
        event_types: [...prev.event_types, newEventType.trim()],
      }));
      setNewEventType('');
    }
  };

  const removeEventType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.filter(t => t !== type),
    }));
  };

  const calculateDeposit = () => {
    setFormData(prev => ({
      ...prev,
      deposit: Math.round(prev.price * 0.5),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {service ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Full Glam Makeup"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this service includes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="/images/service.jpg"
                  />
                  {formData.image_url && (
                    <div className="h-10 w-10 rounded border overflow-hidden flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (for strikethrough)</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    original_price: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  min={0}
                  step={0.01}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deposit" className="flex items-center gap-2">
                  Deposit Amount (50% default)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      deposit: e.target.value ? parseFloat(e.target.value) : null 
                    }))}
                    min={0}
                    step={0.01}
                    placeholder="Auto-calculated"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={calculateDeposit}>
                    50%
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
                <Input
                  id="stripe_price_id"
                  value={formData.stripe_price_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, stripe_price_id: e.target.value }))}
                  placeholder="price_xxx"
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pricing Summary:</strong><br />
                Price: ${formData.price.toFixed(2)}<br />
                Deposit (50%): ${(formData.deposit ?? formData.price * 0.5).toFixed(2)}<br />
                Balance Due: ${(formData.price - (formData.deposit ?? formData.price * 0.5)).toFixed(2)}
              </p>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration Display
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 60 min, 1.5 hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                  min={15}
                  step={15}
                />
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                What's Included
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  placeholder="Add included feature..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                />
                <Button type="button" variant="outline" onClick={addInclude}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.includes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 pr-1">
                    {item}
                    <button
                      onClick={() => removeInclude(index)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Event Types */}
            <div className="space-y-2">
              <Label>Event Types (for filtering)</Label>
              <div className="flex gap-2">
                <Input
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  placeholder="e.g., wedding, prom, quinceanera"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEventType())}
                />
                <Button type="button" variant="outline" onClick={addEventType}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.event_types.map((type) => (
                  <Badge key={type} variant="outline" className="gap-1 pr-1">
                    {type}
                    <button
                      onClick={() => removeEventType(type)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="text-base font-medium">Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Service is visible and bookable
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_popular" className="text-base font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Popular / Featured
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight this service as popular
                  </p>
                </div>
                <Switch
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !formData.name || formData.price <= 0}>
            {saving ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
