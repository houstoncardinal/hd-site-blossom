import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PricingTier } from '@/types/pricing';

interface UsePricingTiersReturn {
  tiers: PricingTier[];
  loading: boolean;
  createTier: (data: Partial<PricingTier>) => Promise<boolean>;
  updateTier: (id: string, updates: Partial<PricingTier>) => Promise<boolean>;
  deleteTier: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePricingTiers(): UsePricingTiersReturn {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTiers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('tier_level', { ascending: true });

      if (error) throw error;

      setTiers(data || []);
    } catch (error: any) {
      console.error('Error fetching pricing tiers:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load pricing tiers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const createTier = async (data: Partial<PricingTier>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('pricing_tiers').insert([data]);

      if (error) throw error;

      await fetchTiers();
      return true;
    } catch (error: any) {
      console.error('Error creating tier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create tier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateTier = async (id: string, updates: Partial<PricingTier>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('pricing_tiers').update(updates).eq('id', id);

      if (error) throw error;

      // Optimistic update
      setTiers((prev) => prev.map((tier) => (tier.id === id ? { ...tier, ...updates } : tier)));

      return true;
    } catch (error: any) {
      console.error('Error updating tier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTier = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);

      if (error) throw error;

      // Optimistic update
      setTiers((prev) => prev.filter((tier) => tier.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting tier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete tier',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    tiers,
    loading,
    createTier,
    updateTier,
    deleteTier,
    refetch: fetchTiers,
  };
}
