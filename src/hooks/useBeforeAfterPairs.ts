import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage } from '@/types/gallery';

export interface BeforeAfterPair {
  id: string;
  before_image_id: string;
  after_image_id: string;
  title: string | null;
  description: string | null;
  service_type: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  before_image?: GalleryImage;
  after_image?: GalleryImage;
}

export interface BeforeAfterPairInsert {
  before_image_id: string;
  after_image_id: string;
  title?: string;
  description?: string;
  service_type?: string;
  is_published?: boolean;
  display_order?: number;
}

export function useBeforeAfterPairs() {
  const [pairs, setPairs] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPairs = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('before_after_pairs')
        .select(`
          *,
          before_image:gallery_images!before_after_pairs_before_image_id_fkey(*),
          after_image:gallery_images!before_after_pairs_after_image_id_fkey(*)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setPairs((data || []) as BeforeAfterPair[]);
    } catch (error) {
      console.error('Error fetching before/after pairs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load before/after pairs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  const createPair = async (data: BeforeAfterPairInsert): Promise<boolean> => {
    try {
      // Get current max order
      const { data: existing } = await supabase
        .from('before_after_pairs')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      const maxOrder = existing?.[0]?.display_order || 0;

      const { error } = await supabase.from('before_after_pairs').insert({
        ...data,
        display_order: data.display_order ?? maxOrder + 1,
      });

      if (error) throw error;

      await fetchPairs();

      toast({
        title: 'Success',
        description: 'Before/after pair created successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error creating before/after pair:', error);
      toast({
        title: 'Error',
        description: 'Failed to create before/after pair.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePair = async (
    id: string,
    updates: Partial<BeforeAfterPair>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('before_after_pairs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchPairs();

      toast({
        title: 'Success',
        description: 'Before/after pair updated successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error updating before/after pair:', error);
      toast({
        title: 'Error',
        description: 'Failed to update before/after pair.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deletePair = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('before_after_pairs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPairs((prev) => prev.filter((p) => p.id !== id));

      toast({
        title: 'Success',
        description: 'Before/after pair deleted successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting before/after pair:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete before/after pair.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const reorderPairs = async (
    reorderedPairs: { id: string; display_order: number }[]
  ): Promise<boolean> => {
    try {
      for (const pair of reorderedPairs) {
        const { error } = await supabase
          .from('before_after_pairs')
          .update({ display_order: pair.display_order })
          .eq('id', pair.id);

        if (error) throw error;
      }

      await fetchPairs();
      return true;
    } catch (error) {
      console.error('Error reordering pairs:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder pairs.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    pairs,
    loading,
    createPair,
    updatePair,
    deletePair,
    reorderPairs,
    refetch: fetchPairs,
  };
}
