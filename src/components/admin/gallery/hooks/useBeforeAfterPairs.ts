import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BeforeAfterPair {
  before_image_id: string;
  before_storage_path: string;
  before_thumbnail_path: string | null;
  before_title: string | null;
  after_image_id: string;
  after_storage_path: string;
  after_thumbnail_path: string | null;
  after_title: string | null;
  transformation_notes: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

interface UseBeforeAfterPairsReturn {
  pairs: BeforeAfterPair[];
  loading: boolean;
  linkPair: (beforeId: string, afterId: string, notes: string | null) => Promise<boolean>;
  unlinkPair: (imageId: string) => Promise<boolean>;
  updatePair: (beforeId: string, notes: string | null) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useBeforeAfterPairs(): UseBeforeAfterPairsReturn {
  const [pairs, setPairs] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPairs = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('before_after_pairs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setPairs(data || []);
    } catch (error: any) {
      console.error('Error fetching before/after pairs:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load before/after pairs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  const linkPair = async (
    beforeId: string,
    afterId: string,
    notes: string | null
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('link_before_after_images', {
        p_before_image_id: beforeId,
        p_after_image_id: afterId,
        p_transformation_notes: notes,
      });

      if (error) throw error;

      await fetchPairs();
      return true;
    } catch (error: any) {
      console.error('Error linking images:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create before/after pair',
        variant: 'destructive',
      });
      return false;
    }
  };

  const unlinkPair = async (imageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('unlink_before_after_images', {
        p_image_id: imageId,
      });

      if (error) throw error;

      await fetchPairs();
      return true;
    } catch (error: any) {
      console.error('Error unlinking images:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to unlink before/after pair',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePair = async (beforeId: string, notes: string | null): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ transformation_notes: notes })
        .eq('id', beforeId);

      if (error) throw error;

      // Also update the paired after image
      const { data: beforeImage } = await supabase
        .from('gallery_images')
        .select('before_after_pair_id')
        .eq('id', beforeId)
        .single();

      if (beforeImage?.before_after_pair_id) {
        await supabase
          .from('gallery_images')
          .update({ transformation_notes: notes })
          .eq('id', beforeImage.before_after_pair_id);
      }

      await fetchPairs();
      return true;
    } catch (error: any) {
      console.error('Error updating pair:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update transformation notes',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    pairs,
    loading,
    linkPair,
    unlinkPair,
    updatePair,
    refetch: fetchPairs,
  };
}
