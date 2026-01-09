import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ServicePackage } from '@/types/services';

interface UsePackagesReturn {
  packages: ServicePackage[];
  loading: boolean;
  createPackage: (data: Partial<ServicePackage>) => Promise<boolean>;
  updatePackage: (id: string, updates: Partial<ServicePackage>) => Promise<boolean>;
  deletePackage: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePackages(): UsePackagesReturn {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('service_packages')
        .select(`
          *,
          service_count:package_services(count)
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform data to include service_count
      const transformedData = (data || []).map((pkg: any) => ({
        ...pkg,
        service_count: pkg.service_count?.[0]?.count || 0,
      }));

      setPackages(transformedData);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load packages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const createPackage = async (data: Partial<ServicePackage>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('service_packages').insert([data]);

      if (error) throw error;

      await fetchPackages();
      return true;
    } catch (error: any) {
      console.error('Error creating package:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create package',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePackage = async (id: string, updates: Partial<ServicePackage>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('service_packages').update(updates).eq('id', id);

      if (error) throw error;

      // Optimistic update
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
      );

      return true;
    } catch (error: any) {
      console.error('Error updating package:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update package',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deletePackage = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('service_packages').delete().eq('id', id);

      if (error) throw error;

      // Optimistic update
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete package',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    refetch: fetchPackages,
  };
}
