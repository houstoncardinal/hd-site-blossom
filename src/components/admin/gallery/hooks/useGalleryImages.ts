import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage, GalleryFilters } from '@/types/gallery';

interface UseGalleryImagesOptions {
  category?: string;
  filters?: GalleryFilters;
  limit?: number;
  offset?: number;
}

export function useGalleryImages(options: UseGalleryImagesOptions = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.filters?.is_featured !== undefined) {
        query = query.eq('is_featured', options.filters.is_featured);
      }

      if (options.filters?.is_published !== undefined) {
        query = query.eq('is_published', options.filters.is_published);
      }

      if (options.filters?.tags && options.filters.tags.length > 0) {
        query = query.contains('tags', options.filters.tags);
      }

      if (options.filters?.search) {
        query = query.or(
          `title.ilike.%${options.filters.search}%,description.ilike.%${options.filters.search}%,alt_text.ilike.%${options.filters.search}%`
        );
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setImages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [options.category, options.filters, options.limit, options.offset, toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    try {
      const { error: updateError } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Optimistically update local state
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
      );

      toast({
        title: 'Success',
        description: 'Image updated successfully',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update image';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteImage = async (id: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update local state
      setImages((prev) => prev.filter((img) => img.id !== id));

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const reorderImages = async (startIndex: number, endIndex: number) => {
    try {
      const reorderedImages = Array.from(images);
      const [removed] = reorderedImages.splice(startIndex, 1);
      reorderedImages.splice(endIndex, 0, removed);

      // Update display_order for all affected images
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        display_order: index,
      }));

      // Optimistically update local state
      setImages(reorderedImages);

      // Update database
      for (const update of updates) {
        await supabase
          .from('gallery_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({
        title: 'Success',
        description: 'Images reordered successfully',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder images';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // Revert on error
      fetchImages();
      return false;
    }
  };

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
    updateImage,
    deleteImage,
    reorderImages,
  };
}
