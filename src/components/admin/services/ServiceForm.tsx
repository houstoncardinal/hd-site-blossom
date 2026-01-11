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
import type { Service, ServiceCategory } from '@/types/services';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess: () => void;
}

export const ServiceForm = ({ open, onClose, service, onSuccess }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'makeup' as ServiceCategory,
    base_price: '',
    duration_minutes: '',
    deposit_percentage: '',
    image_url: null as string | null,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const { createService, updateService } = useServices();
  const { toast } = useToast();

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description || '',
        category: service.category,
        base_price: service.base_price.toString(),
        duration_minutes: service.duration_minutes.toString(),
        deposit_percentage: service.deposit_percentage?.toString() || '',
        image_url: service.image_url || null,
        is_active: service.is_active,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        category: 'makeup',
        base_price: '',
        duration_minutes: '',
        deposit_percentage: '',
        image_url: null,
        is_active: true,
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

    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid base price is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.duration_minutes || parseInt(formData.duration_minutes) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid duration is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    // Auto-generate slug if not provided
    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const data = {
      name: formData.name.trim(),
      slug,
      description: formData.description.trim() || null,
      category: formData.category,
      base_price: parseFloat(formData.base_price),
      duration_minutes: parseInt(formData.duration_minutes),
      deposit_percentage: formData.deposit_percentage ? parseFloat(formData.deposit_percentage) : null,
      image_url: formData.image_url,
      is_active: formData.is_active,
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

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug
              <span className="text-xs text-muted-foreground ml-2">
                (auto-generated if empty)
              </span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                })
              }
              placeholder="bridal-makeup"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ServiceCategory })}
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
                <SelectItem value="bundle">Bundle</SelectItem>
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
              <Label htmlFor="base_price">Base Price * ($)</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="150.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_percentage">Deposit % (optional)</Label>
              <Input
                id="deposit_percentage"
                type="number"
                step="1"
                min="0"
                max="100"
                value={formData.deposit_percentage}
                onChange={(e) => setFormData({ ...formData, deposit_percentage: e.target.value })}
                placeholder="20"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration * (minutes)</Label>
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

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active Status</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
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
