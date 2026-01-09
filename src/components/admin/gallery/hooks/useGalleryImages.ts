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

// Fallback gallery images from public folder
const fallbackImages: GalleryImage[] = [
  {
    id: 'fallback-1',
    storage_path: 'IMG_8915.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8915.JPG',
    file_size: 1024000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Bridal Makeup Session',
    description: 'Beautiful bridal makeup with soft glam look',
    alt_text: 'Professional bridal makeup artist applying makeup to bride',
    category: 'bridal',
    tags: ['bridal', 'makeup', 'wedding', 'soft glam'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: true,
    is_published: true,
    display_order: 1,
    uploaded_by: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'fallback-2',
    storage_path: 'IMG_8916.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8916.JPG',
    file_size: 950000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Evening Glam Look',
    description: 'Stunning evening makeup for special events',
    alt_text: 'Evening glam makeup with dramatic eyes and red lips',
    category: 'evening_glam',
    tags: ['evening', 'glam', 'party', 'red lips'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: true,
    is_published: true,
    display_order: 2,
    uploaded_by: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'fallback-3',
    storage_path: 'IMG_8918.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8918.JPG',
    file_size: 1100000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Natural Beauty Makeup',
    description: 'Natural makeup that enhances your features',
    alt_text: 'Natural makeup look with subtle enhancement',
    category: 'natural_beauty',
    tags: ['natural', 'beauty', 'subtle', 'enhancement'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: false,
    is_published: true,
    display_order: 3,
    uploaded_by: null,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 'fallback-4',
    storage_path: 'IMG_8919.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8919.JPG',
    file_size: 980000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Editorial Photography',
    description: 'High-fashion editorial makeup for photoshoots',
    alt_text: 'Editorial makeup with artistic eye makeup and contouring',
    category: 'editorial',
    tags: ['editorial', 'fashion', 'photoshoot', 'artistic'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: true,
    is_published: true,
    display_order: 4,
    uploaded_by: null,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
  {
    id: 'fallback-5',
    storage_path: 'IMG_8920.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8920.JPG',
    file_size: 1050000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Special Event Makeup',
    description: 'Perfect makeup for weddings and special occasions',
    alt_text: 'Special event makeup with elegant styling',
    category: 'special_events',
    tags: ['wedding', 'special event', 'elegant', 'occasion'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: false,
    is_published: true,
    display_order: 5,
    uploaded_by: null,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 'fallback-6',
    storage_path: 'IMG_8949.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8949.JPG',
    file_size: 920000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Soft Glam Transformation',
    description: 'Before and after soft glam makeup',
    alt_text: 'Soft glam makeup transformation showing natural beauty enhancement',
    category: 'before_after',
    tags: ['before after', 'transformation', 'soft glam', 'natural'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: true,
    is_published: true,
    display_order: 6,
    uploaded_by: null,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
  },
  {
    id: 'fallback-7',
    storage_path: 'IMG_8950.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8950.JPG',
    file_size: 1000000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Hair Styling & Makeup',
    description: 'Complete hair and makeup styling service',
    alt_text: 'Professional hair styling combined with makeup artistry',
    category: 'hair_styling',
    tags: ['hair styling', 'makeup', 'complete look', 'professional'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: false,
    is_published: true,
    display_order: 7,
    uploaded_by: null,
    created_at: '2024-01-07T00:00:00Z',
    updated_at: '2024-01-07T00:00:00Z',
  },
  {
    id: 'fallback-8',
    storage_path: 'IMG_8951.JPG',
    thumbnail_path: null,
    file_name: 'IMG_8951.JPG',
    file_size: 1080000,
    mime_type: 'image/jpeg',
    width: 1200,
    height: 1800,
    aspect_ratio: 0.67,
    title: 'Celebrity Glam',
    description: 'Red carpet ready celebrity makeup',
    alt_text: 'Celebrity-level makeup with flawless application',
    category: 'celebrity',
    tags: ['celebrity', 'red carpet', 'flawless', 'high-end'],
    ai_tags: [],
    ai_description: null,
    ai_confidence: null,
    ai_processed_at: null,
    is_featured: true,
    is_published: true,
    display_order: 8,
    uploaded_by: null,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
];

export function useGalleryImages(options: UseGalleryImagesOptions = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from database first
      let dbImages: GalleryImage[] = [];
      try {
        // Use type assertion to bypass TypeScript checks for non-existent table
        const query = (supabase as any)
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        // Apply filters
        let filteredQuery = query;
        if (options.category) {
          filteredQuery = filteredQuery.eq('category', options.category);
        }

        if (options.filters?.is_featured !== undefined) {
          filteredQuery = filteredQuery.eq('is_featured', options.filters.is_featured);
        }

        if (options.filters?.is_published !== undefined) {
          filteredQuery = filteredQuery.eq('is_published', options.filters.is_published);
        }

        if (options.filters?.tags && options.filters.tags.length > 0) {
          filteredQuery = filteredQuery.contains('tags', options.filters.tags);
        }

        if (options.filters?.search) {
          filteredQuery = filteredQuery.or(
            `title.ilike.%${options.filters.search}%,description.ilike.%${options.filters.search}%,alt_text.ilike.%${options.filters.search}%`
          );
        }

        // Apply pagination
        if (options.limit) {
          filteredQuery = filteredQuery.limit(options.limit);
        }

        if (options.offset) {
          filteredQuery = filteredQuery.range(options.offset, options.offset + (options.limit || 50) - 1);
        }

        const { data, error: fetchError } = await filteredQuery;

        if (!fetchError && data) {
          dbImages = data as GalleryImage[];
        }
      } catch (dbError) {
        // Database table doesn't exist, use fallback images
        console.warn('Gallery database not available, using fallback images');
      }

      // If no database images, use fallback images
      let allImages = dbImages.length > 0 ? dbImages : fallbackImages;

      // Apply client-side filtering if needed
      if (options.category && dbImages.length === 0) {
        allImages = allImages.filter(img => img.category === options.category);
      }

      if (options.filters?.is_featured !== undefined && dbImages.length === 0) {
        allImages = allImages.filter(img => img.is_featured === options.filters?.is_featured);
      }

      if (options.filters?.is_published !== undefined && dbImages.length === 0) {
        allImages = allImages.filter(img => img.is_published === options.filters?.is_published);
      }

      if (options.filters?.search && dbImages.length === 0) {
        const searchTerm = options.filters.search.toLowerCase();
        allImages = allImages.filter(img =>
          img.title?.toLowerCase().includes(searchTerm) ||
          img.description?.toLowerCase().includes(searchTerm) ||
          img.alt_text.toLowerCase().includes(searchTerm) ||
          img.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply pagination
      if (options.limit) {
        allImages = allImages.slice(0, options.limit);
      }

      if (options.offset) {
        allImages = allImages.slice(options.offset);
      }

      setImages(allImages);
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
      // For fallback images, just update local state
      if (id.startsWith('fallback-')) {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
        );
        toast({
          title: 'Success',
          description: 'Image updated successfully',
        });
        return true;
      }

      // Try database update
      const { error: updateError } = await (supabase as any)
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
      // For fallback images, just update local state
      if (id.startsWith('fallback-')) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast({
          title: 'Success',
          description: 'Image deleted successfully',
        });
        return true;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await (supabase as any)
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

      // For fallback images, just update local state
      if (updates.some(u => u.id.startsWith('fallback-'))) {
        toast({
          title: 'Success',
          description: 'Images reordered successfully',
        });
        return true;
      }

      // Update database
      for (const update of updates) {
        await (supabase as any)
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
