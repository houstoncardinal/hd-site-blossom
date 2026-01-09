import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/types/services';

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  createService: (data: Partial<Service>) => Promise<boolean>;
  updateService: (id: string, updates: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const createService = async (data: Partial<Service>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('services').insert([data]);

      if (error) throw error;

      await fetchServices();
      return true;
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('services').update(updates).eq('id', id);

      if (error) throw error;

      // Optimistic update
      setServices((prev) =>
        prev.map((service) => (service.id === id ? { ...service, ...updates } : service))
      );

      return true;
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);

      if (error) throw error;

      // Optimistic update
      setServices((prev) => prev.filter((service) => service.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete service',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
}
