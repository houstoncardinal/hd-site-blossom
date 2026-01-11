import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PricingRule } from '@/types/pricing';

interface UsePricingRulesReturn {
  rules: PricingRule[];
  loading: boolean;
  createRule: (data: Partial<PricingRule>) => Promise<boolean>;
  updateRule: (id: string, updates: Partial<PricingRule>) => Promise<boolean>;
  deleteRule: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePricingRules(): UsePricingRulesReturn {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRules = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      setRules(data || []);
    } catch (error: any) {
      console.error('Error fetching pricing rules:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load pricing rules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const createRule = async (data: Partial<PricingRule>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('pricing_rules').insert([data]);

      if (error) throw error;

      await fetchRules();
      return true;
    } catch (error: any) {
      console.error('Error creating pricing rule:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create pricing rule',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateRule = async (id: string, updates: Partial<PricingRule>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('pricing_rules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRules((prev) =>
        prev.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
      );

      return true;
    } catch (error: any) {
      console.error('Error updating pricing rule:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update pricing rule',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('pricing_rules').delete().eq('id', id);

      if (error) throw error;

      setRules((prev) => prev.filter((rule) => rule.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting pricing rule:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete pricing rule',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    rules,
    loading,
    createRule,
    updateRule,
    deleteRule,
    refetch: fetchRules,
  };
}
