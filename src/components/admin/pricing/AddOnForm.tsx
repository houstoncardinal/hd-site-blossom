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
import { Switch } from '@/components/ui/switch';
import { useAddOns } from './hooks/useAddOns';
import { useToast } from '@/hooks/use-toast';
import type { AddOn } from '@/types/pricing';

interface AddOnFormProps {
  open: boolean;
  onClose: () => void;
  addOn?: AddOn | null;
  onSuccess: () => void;
}

export const AddOnForm = ({ open, onClose, addOn, onSuccess }: AddOnFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const { createAddOn, updateAddOn } = useAddOns();
  const { toast } = useToast();

  useEffect(() => {
    if (addOn) {
      setFormData({
        name: addOn.name,
        description: addOn.description || '',
        price: addOn.price.toString(),
        duration_minutes: addOn.duration_minutes?.toString() || '',
        is_active: addOn.is_active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
        is_active: true,
      });
    }
  }, [addOn, open]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Add-on name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
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
      price: parseFloat(formData.price),
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      is_active: formData.is_active,
    };

    let success = false;
    if (addOn) {
      success = await updateAddOn(addOn.id, data);
    } else {
      success = await createAddOn(data);
    }

    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: `Add-on ${addOn ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{addOn ? 'Edit Add-On' : 'Create Add-On'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., False Lashes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the add-on..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price * ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="15.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (min)</Label>
              <Input
                id="duration_minutes"
                type="number"
                step="5"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                placeholder="15"
              />
            </div>
          </div>

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
            {saving ? 'Saving...' : addOn ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
