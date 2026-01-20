import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryCollection, GalleryCollectionInsert } from '@/types/gallery';

interface UseCollectionsReturn {
  collections: GalleryCollection[];
  loading: boolean;
  createCollection: (data: GalleryCollectionInsert) => Promise<boolean>;
  updateCollection: (id: string, updates: Partial<GalleryCollection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  addImageToCollection: (collectionId: string, imageId: string) => Promise<boolean>;
  removeImageFromCollection: (collectionId: string, imageId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch collections with image count
      const { data, error } = await supabase
        .from('gallery_collections')
        .select(`
          *,
          cover_image:gallery_images!gallery_collections_cover_image_id_fkey(storage_path)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Get image counts for each collection
      const collectionsWithCounts = await Promise.all(
        (data || []).map(async (collection) => {
          const { count } = await supabase
            .from('gallery_collection_images')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          return {
            ...collection,
            image_count: count || 0,
            cover_image_path: collection.cover_image?.storage_path || null,
          } as GalleryCollection;
        })
      );

      setCollections(collectionsWithCounts);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load collections.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = async (data: GalleryCollectionInsert): Promise<boolean> => {
    try {
      const { error } = await supabase.from('gallery_collections').insert(data);

      if (error) throw error;

      await fetchCollections();
      return true;
    } catch (error: unknown) {
      console.error('Error creating collection:', error);
      toast({
        title: 'Error',
        description: error instanceof Error && error.message.includes('duplicate')
          ? 'A collection with this slug already exists.'
          : 'Failed to create collection.',
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

      await fetchCollections();
      return true;
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to update collection.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCollections((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete collection.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addImageToCollection = async (
    collectionId: string,
    imageId: string
  ): Promise<boolean> => {
    try {
      // Get current max order
      const { data: existing } = await supabase
        .from('gallery_collection_images')
        .select('display_order')
        .eq('collection_id', collectionId)
        .order('display_order', { ascending: false })
        .limit(1);

      const maxOrder = existing?.[0]?.display_order || 0;

      const { error } = await supabase.from('gallery_collection_images').insert({
        collection_id: collectionId,
        image_id: imageId,
        display_order: maxOrder + 1,
      });

      if (error) throw error;

      await fetchCollections();
      return true;
    } catch (error) {
      console.error('Error adding image to collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to add image to collection.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeImageFromCollection = async (
    collectionId: string,
    imageId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_collection_images')
        .delete()
        .eq('collection_id', collectionId)
        .eq('image_id', imageId);

      if (error) throw error;

      await fetchCollections();
      return true;
    } catch (error) {
      console.error('Error removing image from collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove image from collection.',
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
    addImageToCollection,
    removeImageFromCollection,
    refetch: fetchCollections,
  };
}
