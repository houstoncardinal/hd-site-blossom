import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PricingRuleForm } from './PricingRuleForm';
import { usePricingRules } from './hooks/usePricingRules';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Zap,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PricingRule } from '@/types/pricing';
import { PRICING_RULE_TYPE_LABELS } from '@/types/pricing';

export const PricingRulesManager = () => {
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { rules, loading, updateRule, deleteRule, refetch } = usePricingRules();
  const { toast } = useToast();

  const filteredRules = rules.filter((rule) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      rule.name.toLowerCase().includes(query) ||
      rule.description?.toLowerCase().includes(query) ||
      PRICING_RULE_TYPE_LABELS[rule.rule_type].toLowerCase().includes(query)
    );
  });

  const handleOpenDialog = (rule?: PricingRule) => {
    setEditingRule(rule || null);
    setRuleDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRuleDialogOpen(false);
    setEditingRule(null);
  };

  const handleToggleActive = async (rule: PricingRule) => {
    const success = await updateRule(rule.id, { is_active: !rule.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Rule ${rule.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (rule: PricingRule) => {
    if (!confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      return;
    }

    const success = await deleteRule(rule.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Pricing rule deleted successfully',
      });
    }
  };

  const formatModifier = (rule: PricingRule) => {
    if (rule.price_modifier_type === 'percentage') {
      return `${rule.price_modifier_value > 0 ? '+' : ''}${rule.price_modifier_value}%`;
    } else {
      return `${rule.price_modifier_value > 0 ? '+' : ''}$${Math.abs(rule.price_modifier_value)}`;
    }
  };

  const formatDateRange = (rule: PricingRule) => {
    if (rule.valid_from && rule.valid_until) {
      return `${new Date(rule.valid_from).toLocaleDateString()} - ${new Date(rule.valid_until).toLocaleDateString()}`;
    } else if (rule.valid_from) {
      return `From ${new Date(rule.valid_from).toLocaleDateString()}`;
    } else if (rule.valid_until) {
      return `Until ${new Date(rule.valid_until).toLocaleDateString()}`;
    }
    return 'Always active';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Dynamic Pricing Rules
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatic price adjustments based on conditions
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{rules.length} total</Badge>
          <Badge variant="default">{rules.filter((r) => r.is_active).length} active</Badge>
        </div>
      </div>

      {/* Rules Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading pricing rules...</p>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="text-center py-12">
          <Zap size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No pricing rules found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first dynamic pricing rule'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenDialog()}>
              <Plus size={16} className="mr-2" />
              Add Rule
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{rule.name}</h4>
                      {rule.priority > 0 && (
                        <Badge variant="outline" className="text-xs">
                          P{rule.priority}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {PRICING_RULE_TYPE_LABELS[rule.rule_type]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {!rule.is_active && (
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(rule)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(rule)}>
                          {rule.is_active ? (
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
                          onClick={() => handleDelete(rule)}
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
                {rule.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{rule.description}</p>
                )}

                {/* Modifier */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <TrendingUp size={14} className="text-muted-foreground" />
                  <span
                    className={`font-medium ${rule.price_modifier_value > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatModifier(rule)}
                  </span>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>{formatDateRange(rule)}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pricing Rule Form Dialog */}
      <PricingRuleForm
        open={ruleDialogOpen}
        onClose={handleCloseDialog}
        rule={editingRule}
        onSuccess={refetch}
      />
    </div>
  );
};
