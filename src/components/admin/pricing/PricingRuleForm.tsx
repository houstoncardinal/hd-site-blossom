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
import { usePricingRules } from './hooks/usePricingRules';
import { useToast } from '@/hooks/use-toast';
import type { PricingRule, PricingRuleType, PriceModifierType } from '@/types/pricing';
import { PRICING_RULE_TYPE_LABELS } from '@/types/pricing';

interface PricingRuleFormProps {
  open: boolean;
  onClose: () => void;
  rule?: PricingRule | null;
  onSuccess: () => void;
}

export const PricingRuleForm = ({ open, onClose, rule, onSuccess }: PricingRuleFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rule_type: 'day_of_week' as PricingRuleType,
    conditions: '{}',
    price_modifier_type: 'percentage' as PriceModifierType,
    price_modifier_value: '',
    priority: '0',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const { createRule, updateRule } = usePricingRules();
  const { toast } = useToast();

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description || '',
        rule_type: rule.rule_type,
        conditions: JSON.stringify(rule.conditions, null, 2),
        price_modifier_type: rule.price_modifier_type,
        price_modifier_value: rule.price_modifier_value.toString(),
        priority: rule.priority.toString(),
        valid_from: rule.valid_from || '',
        valid_until: rule.valid_until || '',
        is_active: rule.is_active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        rule_type: 'day_of_week',
        conditions: JSON.stringify({ days: ['saturday', 'sunday'] }, null, 2),
        price_modifier_type: 'percentage',
        price_modifier_value: '20',
        priority: '0',
        valid_from: '',
        valid_until: '',
        is_active: true,
      });
    }
  }, [rule, open]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Rule name is required',
        variant: 'destructive',
      });
      return;
    }

    let parsedConditions;
    try {
      parsedConditions = JSON.parse(formData.conditions);
    } catch (e) {
      toast({
        title: 'Validation Error',
        description: 'Conditions must be valid JSON',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.price_modifier_value || parseFloat(formData.price_modifier_value) === 0) {
      toast({
        title: 'Validation Error',
        description: 'Price modifier value is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      rule_type: formData.rule_type,
      conditions: parsedConditions,
      price_modifier_type: formData.price_modifier_type,
      price_modifier_value: parseFloat(formData.price_modifier_value),
      priority: parseInt(formData.priority) || 0,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      is_active: formData.is_active,
    };

    let success = false;
    if (rule) {
      success = await updateRule(rule.id, data);
    } else {
      success = await createRule(data);
    }

    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: `Pricing rule ${rule ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Weekend Surcharge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe when this rule applies..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule_type">Rule Type *</Label>
              <Select
                value={formData.rule_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, rule_type: value as PricingRuleType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(PRICING_RULE_TYPE_LABELS) as [PricingRuleType, string][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Higher priority rules apply first</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Conditions (JSON) *</Label>
            <Textarea
              id="conditions"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              placeholder='{"days": ["saturday", "sunday"]}'
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Example for day_of_week: {'{'}&#34;days&#34;: [&#34;saturday&#34;, &#34;sunday&#34;]
              {'}'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modifier_type">Modifier Type *</Label>
              <Select
                value={formData.price_modifier_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, price_modifier_type: value as PriceModifierType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modifier_value">
                Modifier Value * {formData.price_modifier_type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="modifier_value"
                type="number"
                step="0.01"
                value={formData.price_modifier_value}
                onChange={(e) =>
                  setFormData({ ...formData, price_modifier_value: e.target.value })
                }
                placeholder={formData.price_modifier_type === 'percentage' ? '20' : '15.00'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until</Label>
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
            {saving ? 'Saving...' : rule ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
