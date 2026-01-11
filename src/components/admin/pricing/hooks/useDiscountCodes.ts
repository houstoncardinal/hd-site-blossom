import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DiscountCode } from '@/types/pricing';

interface UseDiscountCodesReturn {
  discounts: DiscountCode[];
  loading: boolean;
  createDiscount: (data: Partial<DiscountCode>) => Promise<boolean>;
  updateDiscount: (id: string, updates: Partial<DiscountCode>) => Promise<boolean>;
  deleteDiscount: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useDiscountCodes(): UseDiscountCodesReturn {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDiscounts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDiscounts(data || []);
    } catch (error: any) {
      console.error('Error fetching discount codes:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load discount codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const createDiscount = async (data: Partial<DiscountCode>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('discount_codes').insert([data]);

      if (error) throw error;

      await fetchDiscounts();
      return true;
    } catch (error: any) {
      console.error('Error creating discount code:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create discount code',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateDiscount = async (
    id: string,
    updates: Partial<DiscountCode>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setDiscounts((prev) =>
        prev.map((discount) => (discount.id === id ? { ...discount, ...updates } : discount))
      );

      return true;
    } catch (error: any) {
      console.error('Error updating discount code:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update discount code',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteDiscount = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('discount_codes').delete().eq('id', id);

      if (error) throw error;

      setDiscounts((prev) => prev.filter((discount) => discount.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting discount code:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete discount code',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    discounts,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    refetch: fetchDiscounts,
  };
}
