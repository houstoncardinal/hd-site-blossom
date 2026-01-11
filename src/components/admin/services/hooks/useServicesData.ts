import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  deposit: number | null;
  duration: string | null;
  duration_minutes: number | null;
  image_url: string | null;
  category: string;
  includes: string[] | null;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  stripe_price_id: string | null;
  event_types: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  deposit: number | null;
  duration: string;
  duration_minutes: number;
  image_url: string;
  category: string;
  includes: string[];
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  stripe_price_id: string;
  event_types: string[];
}

const defaultFormData: ServiceFormData = {
  name: '',
  description: '',
  price: 0,
  original_price: null,
  deposit: null,
  duration: '60 min',
  duration_minutes: 60,
  image_url: '',
  category: 'makeup',
  includes: [],
  is_active: true,
  is_popular: false,
  display_order: 0,
  stripe_price_id: '',
  event_types: [],
};

export const useServicesData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error loading services',
        description: 'Could not load services from database',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

  const createService = async (formData: ServiceFormData): Promise<boolean> => {
    try {
      setSaving(true);
      const { error } = await supabase.from('services').insert({
        name: formData.name,
        description: formData.description || null,
        price: formData.price,
        original_price: formData.original_price,
        deposit: formData.deposit ?? Math.round(formData.price * 0.5),
        duration: formData.duration,
        duration_minutes: formData.duration_minutes,
        image_url: formData.image_url || null,
        category: formData.category,
        includes: formData.includes.length > 0 ? formData.includes : null,
        is_active: formData.is_active,
        is_popular: formData.is_popular,
        display_order: formData.display_order,
        stripe_price_id: formData.stripe_price_id || null,
        event_types: formData.event_types.length > 0 ? formData.event_types : null,
      });

      if (error) throw error;

      toast({ title: 'Service created successfully' });
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error creating service',
        description: 'Could not save service to database',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateService = async (id: string, formData: ServiceFormData): Promise<boolean> => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('services')
        .update({
          name: formData.name,
          description: formData.description || null,
          price: formData.price,
          original_price: formData.original_price,
          deposit: formData.deposit ?? Math.round(formData.price * 0.5),
          duration: formData.duration,
          duration_minutes: formData.duration_minutes,
          image_url: formData.image_url || null,
          category: formData.category,
          includes: formData.includes.length > 0 ? formData.includes : null,
          is_active: formData.is_active,
          is_popular: formData.is_popular,
          display_order: formData.display_order,
          stripe_price_id: formData.stripe_price_id || null,
          event_types: formData.event_types.length > 0 ? formData.event_types : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Service updated successfully' });
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error updating service',
        description: 'Could not update service',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      const { error } = await supabase.from('services').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Service deleted' });
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error deleting service',
        description: 'Could not delete service',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceActive = async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({
        title: 'Error',
        description: 'Could not update service status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleServicePopular = async (id: string, isPopular: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_popular: !isPopular })
        .eq('id', id);

      if (error) throw error;

      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error toggling popular:', error);
      toast({
        title: 'Error',
        description: 'Could not update popular status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const duplicateService = async (service: Service): Promise<boolean> => {
    const formData: ServiceFormData = {
      name: `${service.name} (Copy)`,
      description: service.description || '',
      price: service.price,
      original_price: service.original_price,
      deposit: service.deposit,
      duration: service.duration || '60 min',
      duration_minutes: service.duration_minutes || 60,
      image_url: service.image_url || '',
      category: service.category,
      includes: service.includes || [],
      is_active: false, // Start as inactive
      is_popular: false,
      display_order: service.display_order + 1,
      stripe_price_id: '', // Clear Stripe ID for copy
      event_types: service.event_types || [],
    };
    return createService(formData);
  };

  const reorderServices = async (reorderedServices: Service[]): Promise<boolean> => {
    try {
      const updates = reorderedServices.map((service, index) => ({
        id: service.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('services')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        if (error) throw error;
      }

      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error reordering services:', error);
      toast({
        title: 'Error',
        description: 'Could not reorder services',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Category management
  const createCategory = async (name: string, displayName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('service_categories').insert({
        name: name.toLowerCase().replace(/\s+/g, '-'),
        display_name: displayName,
        display_order: categories.length,
      });

      if (error) throw error;

      toast({ title: 'Category created' });
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Could not create category',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('service_categories').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Category deleted' });
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Could not delete category',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    services,
    categories,
    loading,
    saving,
    defaultFormData,
    fetchServices,
    fetchCategories,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
    toggleServicePopular,
    duplicateService,
    reorderServices,
    createCategory,
    deleteCategory,
  };
};
