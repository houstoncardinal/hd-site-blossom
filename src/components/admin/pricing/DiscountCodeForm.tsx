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
import { useDiscountCodes } from './hooks/useDiscountCodes';
import { useToast } from '@/hooks/use-toast';
import type { DiscountCode, DiscountType } from '@/types/pricing';
import { DISCOUNT_TYPE_LABELS, generateDiscountCode } from '@/types/pricing';
import { Wand2 } from 'lucide-react';

interface DiscountCodeFormProps {
  open: boolean;
  onClose: () => void;
  discount?: DiscountCode | null;
  onSuccess: () => void;
}

export const DiscountCodeForm = ({
  open,
  onClose,
  discount,
  onSuccess,
}: DiscountCodeFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as DiscountType,
    discount_value: '',
    minimum_purchase_amount: '',
    maximum_discount_amount: '',
    usage_limit: '',
    per_user_limit: '1',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const { createDiscount, updateDiscount } = useDiscountCodes();
  const { toast } = useToast();

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        name: discount.name,
        description: discount.description || '',
        discount_type: discount.discount_type,
        discount_value: discount.discount_value.toString(),
        minimum_purchase_amount: discount.minimum_purchase_amount?.toString() || '',
        maximum_discount_amount: discount.maximum_discount_amount?.toString() || '',
        usage_limit: discount.usage_limit?.toString() || '',
        per_user_limit: discount.per_user_limit.toString(),
        valid_from: discount.valid_from.split('T')[0],
        valid_until: discount.valid_until.split('T')[0],
        is_active: discount.is_active,
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setFormData({
        code: '',
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '10',
        minimum_purchase_amount: '',
        maximum_discount_amount: '',
        usage_limit: '',
        per_user_limit: '1',
        valid_from: tomorrow.toISOString().split('T')[0],
        valid_until: nextMonth.toISOString().split('T')[0],
        is_active: true,
      });
    }
  }, [discount, open]);

  const handleGenerateCode = () => {
    setFormData({ ...formData, code: generateDiscountCode(8) });
  };

  const handleSubmit = async () => {
    if (!formData.code.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Discount code is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Discount name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid discount value is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.valid_from || !formData.valid_until) {
      toast({
        title: 'Validation Error',
        description: 'Valid date range is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const data = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      minimum_purchase_amount: formData.minimum_purchase_amount
        ? parseFloat(formData.minimum_purchase_amount)
        : null,
      maximum_discount_amount: formData.maximum_discount_amount
        ? parseFloat(formData.maximum_discount_amount)
        : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      per_user_limit: parseInt(formData.per_user_limit) || 1,
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_until: new Date(formData.valid_until).toISOString(),
      is_active: formData.is_active,
    };

    let success = false;
    if (discount) {
      success = await updateDiscount(discount.id, data);
    } else {
      success = await createDiscount(data);
    }

    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: `Discount code ${discount ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {discount ? 'Edit Discount Code' : 'Create Discount Code'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Discount Code *</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g., WELCOME20"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCode}
                disabled={!!discount}
              >
                <Wand2 size={16} className="mr-2" />
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Welcome Discount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the promotion..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type *</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, discount_type: value as DiscountType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(DISCOUNT_TYPE_LABELS) as [DiscountType, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                placeholder={formData.discount_type === 'percentage' ? '10' : '15.00'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimum_purchase">Minimum Purchase ($)</Label>
              <Input
                id="minimum_purchase"
                type="number"
                step="0.01"
                min="0"
                value={formData.minimum_purchase_amount}
                onChange={(e) =>
                  setFormData({ ...formData, minimum_purchase_amount: e.target.value })
                }
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximum_discount">Maximum Discount ($)</Label>
              <Input
                id="maximum_discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.maximum_discount_amount}
                onChange={(e) =>
                  setFormData({ ...formData, maximum_discount_amount: e.target.value })
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Total Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                min="0"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                placeholder="Unlimited"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="per_user_limit">Per User Limit *</Label>
              <Input
                id="per_user_limit"
                type="number"
                min="1"
                value={formData.per_user_limit}
                onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From *</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until *</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
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
            {saving ? 'Saving...' : discount ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
