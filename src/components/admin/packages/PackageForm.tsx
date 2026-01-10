import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { usePackages } from './hooks/usePackages';
import { useServices } from '../services/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import type { ServicePackage } from '@/types/services';
import { formatPrice, formatDuration } from '@/types/services';

interface PackageFormProps {
  open: boolean;
  onClose: () => void;
  package?: ServicePackage | null;
  onSuccess: () => void;
}

export const PackageForm = ({ open, onClose, package: pkg, onSuccess }: PackageFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    package_price: '',
    deposit_percentage: '',
    is_active: true,
  });

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { createPackage, updatePackage } = usePackages();
  const { services } = useServices();
  const { toast } = useToast();

  const activeServices = services.filter((s) => s.is_active);

  // Calculate totals
  const selectedServices = activeServices.filter((s) => selectedServiceIds.includes(s.id));
  const totalOriginalPrice = selectedServices.reduce((sum, s) => sum + s.base_price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const packagePrice = parseFloat(formData.package_price) || 0;
  const savings = totalOriginalPrice - packagePrice;

  useEffect(() => {
    const loadPackageData = async () => {
      if (pkg) {
        setFormData({
          name: pkg.name,
          slug: pkg.slug,
          description: pkg.description || '',
          package_price: pkg.package_price.toString(),
          deposit_percentage: pkg.deposit_percentage?.toString() || '',
          is_active: pkg.is_active,
        });
        // TODO: Load package services when database is ready
        setSelectedServiceIds([]);
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          package_price: '',
          deposit_percentage: '',
          is_active: true,
        });
        setSelectedServiceIds([]);
      }
    };

    if (open) {
      loadPackageData();
    }
  }, [pkg, open]);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Package name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.package_price || parseFloat(formData.package_price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid package price is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Auto-generate slug if not provided
      const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const packageData: Partial<ServicePackage> = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        package_price: parseFloat(formData.package_price),
        savings_amount: savings > 0 ? savings : undefined,
        total_duration_minutes: totalDuration,
        deposit_percentage: formData.deposit_percentage ? parseFloat(formData.deposit_percentage) : undefined,
        is_active: formData.is_active,
      };

      let success = false;

      if (pkg) {
        success = await updatePackage(pkg.id, packageData);
      } else {
        success = await createPackage(packageData);
      }

      if (success) {
        toast({
          title: 'Success',
          description: `Package ${pkg ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error saving package:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save package',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? 'Edit Package' : 'Create Package'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Bridal Beauty Package"
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
              placeholder="bridal-beauty-package"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the package..."
              rows={3}
            />
          </div>

          <Separator />

          {/* Service Selection */}
          <div className="space-y-3">
            <Label>Select Services</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3">
              {activeServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Services feature is being set up. Please check back later.
                </p>
              ) : (
                activeServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox checked={selectedServiceIds.includes(service.id)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(service.duration_minutes)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(service.base_price)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Package Summary */}
          {selectedServiceIds.length > 0 && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Selected Services:</span>
                <Badge variant="secondary">{selectedServiceIds.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Duration:</span>
                <span className="font-medium">{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Original Price:</span>
                <span className="font-medium">{formatPrice(totalOriginalPrice)}</span>
              </div>
              {packagePrice > 0 && savings > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Savings:</span>
                  <span className="font-semibold">{formatPrice(savings)}</span>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="package_price">Package Price * ($)</Label>
              <Input
                id="package_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.package_price}
                onChange={(e) => setFormData({ ...formData, package_price: e.target.value })}
                placeholder="250.00"
              />
              {packagePrice > 0 && packagePrice > totalOriginalPrice && totalOriginalPrice > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Package price is higher than original price
                </p>
              )}
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
              <>{pkg ? 'Update' : 'Create'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
