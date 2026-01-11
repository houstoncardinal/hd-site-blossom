import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TierForm } from './TierForm';
import { usePricingTiers } from './hooks/usePricingTiers';
import { Layers, Plus, MoreVertical, Edit, Trash2, Eye, EyeOff, Award, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PricingTier } from '@/types/pricing';
import { formatPrice } from '@/types/services';

export const TiersManager = () => {
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);

  const { tiers, loading, updateTier, deleteTier, refetch } = usePricingTiers();
  const { toast } = useToast();

  const handleOpenDialog = (tier?: PricingTier) => {
    setEditingTier(tier || null);
    setTierDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setTierDialogOpen(false);
    setEditingTier(null);
  };

  const handleToggleActive = async (tier: PricingTier) => {
    const success = await updateTier(tier.id, { is_active: !tier.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Tier ${tier.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (tier: PricingTier) => {
    if (!confirm(`Are you sure you want to delete the "${tier.name}" tier?`)) {
      return;
    }

    const success = await deleteTier(tier.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Tier deleted successfully',
      });
    }
  };

  const tierColors = {
    bronze: 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
    silver: 'bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700',
    gold: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
    platinum: 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700',
  };

  const tierIcons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Pricing Tiers
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create tiered pricing levels for your services
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Add Tier
        </Button>
      </div>

      {/* Tiers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading tiers...</p>
        </div>
      ) : tiers.length === 0 ? (
        <div className="text-center py-12">
          <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No pricing tiers</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Create your first pricing tier to get started
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={16} className="mr-2" />
            Add Tier
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card
                className={`p-4 space-y-3 hover:shadow-lg transition-shadow border-2 ${
                  tierColors[tier.tier_level as keyof typeof tierColors] || ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-2xl">
                      {tierIcons[tier.tier_level as keyof typeof tierIcons] || '⭐'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{tier.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {tier.tier_level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!tier.is_active && (
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(tier)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(tier)}>
                          {tier.is_active ? (
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
                          onClick={() => handleDelete(tier)}
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
                {tier.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tier.description}
                  </p>
                )}

                {/* Pricing */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Base Price</span>
                    <span className="font-semibold">{formatPrice(tier.base_price)}</span>
                  </div>
                  {tier.price_multiplier && tier.price_multiplier !== 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Multiplier</span>
                      <Badge variant="secondary" className="text-xs">
                        {tier.price_multiplier}x
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Features */}
                {tier.features && tier.features.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Features:</p>
                    <ul className="space-y-1">
                      {tier.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                          <Award size={12} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {tier.features.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{tier.features.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tier Form Dialog */}
      <TierForm
        open={tierDialogOpen}
        onClose={handleCloseDialog}
        tier={editingTier}
        onSuccess={refetch}
      />
    </div>
  );
};
