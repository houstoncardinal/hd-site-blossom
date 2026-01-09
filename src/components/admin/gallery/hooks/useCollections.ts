import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryCollection } from '@/types/gallery';

interface UseCollectionsReturn {
  collections: GalleryCollection[];
  loading: boolean;
  createCollection: (data: Partial<GalleryCollection>) => Promise<boolean>;
  updateCollection: (id: string, updates: Partial<GalleryCollection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('gallery_collections')
        .select(`
          *,
          image_count:gallery_collection_images(count),
          cover_image:cover_image_id(storage_path)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our type
      const transformedData = (data || []).map((collection: any) => ({
        ...collection,
        image_count: collection.image_count?.[0]?.count || 0,
        cover_image_path: collection.cover_image?.storage_path || null,
      }));

      setCollections(transformedData);
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load collections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const createCollection = async (data: Partial<GalleryCollection>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('gallery_collections').insert([data]);

      if (error) throw error;

      await fetchCollections();
      return true;
    } catch (error: any) {
      console.error('Error creating collection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create collection',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateCollection = async (
    id: string,
    updates: Partial<GalleryCollection>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === id ? { ...collection, ...updates } : collection
        )
      );

      return true;
    } catch (error: any) {
      console.error('Error updating collection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update collection',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('gallery_collections').delete().eq('id', id);

      if (error) throw error;

      // Optimistic update
      setCollections((prev) => prev.filter((collection) => collection.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete collection',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    refetch: fetchCollections,
  };
}
