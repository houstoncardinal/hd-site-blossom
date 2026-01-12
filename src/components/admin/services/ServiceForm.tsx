import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ServiceImageUploader } from './ServiceImageUploader';
import { useServices } from './hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/types/services';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess: () => void;
}

export const ServiceForm = ({ open, onClose, service, onSuccess }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'makeup',
    price: '',
    duration: '',
    duration_minutes: '',
    deposit: '',
    image_url: null as string | null,
    is_active: true,
    is_popular: false,
  });

  const [saving, setSaving] = useState(false);
  const { createService, updateService } = useServices();
  const { toast } = useToast();

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        category: service.category,
        price: service.price.toString(),
        duration: service.duration || '',
        duration_minutes: service.duration_minutes?.toString() || '',
        deposit: service.deposit?.toString() || '',
        image_url: service.image_url || null,
        is_active: service.is_active ?? true,
        is_popular: service.is_popular ?? false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'makeup',
        price: '',
        duration: '',
        duration_minutes: '',
        deposit: '',
        image_url: null,
        is_active: true,
        is_popular: false,
      });
    }
  }, [service, open]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid price is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      price: parseFloat(formData.price),
      duration: formData.duration.trim() || null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      deposit: formData.deposit ? parseFloat(formData.deposit) : null,
      image_url: formData.image_url,
      is_active: formData.is_active,
      is_popular: formData.is_popular,
    };

    let success = false;
    if (service) {
      success = await updateService(service.id, data);
    } else {
      success = await createService(data);
    }

    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: `Service ${service ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Create Service'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Bridal Makeup"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="makeup">Makeup</SelectItem>
                <SelectItem value="hair">Hair</SelectItem>
                <SelectItem value="combo">Combo (Makeup & Hair)</SelectItem>
                <SelectItem value="bridal">Bridal</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="addon">Add-on</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service..."
              rows={3}
            />
          </div>

          {/* Service Image */}
          <ServiceImageUploader
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            onImageRemoved={() => setFormData({ ...formData, image_url: null })}
          />

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price * ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit Amount ($)</Label>
              <Input
                id="deposit"
                type="number"
                step="0.01"
                min="0"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                placeholder="50.00"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration Display</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1-2 hours"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                step="15"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                placeholder="90"
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_popular">Mark as Popular</Label>
              <Switch
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>{service ? 'Update' : 'Create'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
