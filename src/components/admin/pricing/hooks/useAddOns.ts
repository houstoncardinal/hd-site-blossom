import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AddOn } from '@/types/pricing';

interface UseAddOnsReturn {
  addOns: AddOn[];
  loading: boolean;
  createAddOn: (data: Partial<AddOn>) => Promise<boolean>;
  updateAddOn: (id: string, updates: Partial<AddOn>) => Promise<boolean>;
  deleteAddOn: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAddOns(): UseAddOnsReturn {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAddOns = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setAddOns(data || []);
    } catch (error: any) {
      console.error('Error fetching add-ons:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load add-ons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddOns();
  }, []);

  const createAddOn = async (data: Partial<AddOn>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('add_ons').insert([data]);

      if (error) throw error;

      await fetchAddOns();
      return true;
    } catch (error: any) {
      console.error('Error creating add-on:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create add-on',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateAddOn = async (id: string, updates: Partial<AddOn>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('add_ons').update(updates).eq('id', id);

      if (error) throw error;

      setAddOns((prev) => prev.map((addOn) => (addOn.id === id ? { ...addOn, ...updates } : addOn)));

      return true;
    } catch (error: any) {
      console.error('Error updating add-on:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update add-on',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteAddOn = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('add_ons').delete().eq('id', id);

      if (error) throw error;

      setAddOns((prev) => prev.filter((addOn) => addOn.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting add-on:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete add-on',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    addOns,
    loading,
    createAddOn,
    updateAddOn,
    deleteAddOn,
    refetch: fetchAddOns,
  };
}
