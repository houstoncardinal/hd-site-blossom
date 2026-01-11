import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { usePricingTiers } from './hooks/usePricingTiers';
import { useToast } from '@/hooks/use-toast';
import type { PricingTier } from '@/types/pricing';
import { X } from 'lucide-react';

interface TierFormProps {
  open: boolean;
  onClose: () => void;
  tier?: PricingTier | null;
  onSuccess: () => void;
}

export const TierForm = ({ open, onClose, tier, onSuccess }: TierFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    tier_level: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum',
    description: '',
    base_price: '',
    price_multiplier: '',
    features: [] as string[],
    is_active: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const { createTier, updateTier } = usePricingTiers();
  const { toast } = useToast();

  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name,
        tier_level: tier.tier_level,
        description: tier.description || '',
        base_price: tier.base_price.toString(),
        price_multiplier: tier.price_multiplier?.toString() || '',
        features: tier.features || [],
        is_active: tier.is_active,
      });
    } else {
      setFormData({
        name: '',
        tier_level: 'bronze',
        description: '',
        base_price: '',
        price_multiplier: '',
        features: [],
        is_active: true,
      });
    }
    setNewFeature('');
  }, [tier, open]);

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeature.trim()],
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tier name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.base_price || parseFloat(formData.base_price) < 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid base price is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const data = {
      name: formData.name.trim(),
      tier_level: formData.tier_level,
      description: formData.description.trim() || null,
      base_price: parseFloat(formData.base_price),
      price_multiplier: formData.price_multiplier ? parseFloat(formData.price_multiplier) : null,
      features: formData.features.length > 0 ? formData.features : null,
      is_active: formData.is_active,
    };

    let success = false;
    if (tier) {
      success = await updateTier(tier.id, data);
    } else {
      success = await createTier(data);
    }

    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: `Tier ${tier ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tier ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tier Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Bridal"
            />
          </div>

          {/* Tier Level */}
          <div className="space-y-2">
            <Label htmlFor="tier_level">Tier Level *</Label>
            <Select
              value={formData.tier_level}
              onValueChange={(value) =>
                setFormData({ ...formData, tier_level: value as typeof formData.tier_level })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">🥉 Bronze</SelectItem>
                <SelectItem value="silver">🥈 Silver</SelectItem>
                <SelectItem value="gold">🥇 Gold</SelectItem>
                <SelectItem value="platinum">💎 Platinum</SelectItem>
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
              placeholder="Describe this tier..."
              rows={3}
            />
          </div>

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
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_multiplier">Price Multiplier (optional)</Label>
              <Input
                id="price_multiplier"
                type="number"
                step="0.1"
                min="0"
                value={formData.price_multiplier}
                onChange={(e) => setFormData({ ...formData, price_multiplier: e.target.value })}
                placeholder="1.0"
              />
              <p className="text-xs text-muted-foreground">
                E.g., 1.5 = 50% price increase
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Add a feature..."
              />
              <Button type="button" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
              <>{tier ? 'Update' : 'Create'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
