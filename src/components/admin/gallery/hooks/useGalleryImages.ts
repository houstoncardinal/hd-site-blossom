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

// Beauty gallery images - same as homepage Gallery component
const galleryImageData = [
  { src: '/IMG_8915.JPG', alt: 'Evening Glam Runway Look', span: 'col-span-1 row-span-2' },
  { src: '/full-glam-cover.jpeg', alt: 'Full Glam Makeup Artistry', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8910.JPG', alt: 'Editorial Fashion Makeup', span: 'col-span-1 row-span-1' },
  { src: '/signature-glam.jpeg', alt: 'Signature Glam Experience', span: 'col-span-1 row-span-2' },
  { src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', alt: 'Elegant Evening Glam', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8900.JPG', alt: 'Bridal Beauty Perfection', span: 'col-span-1 row-span-1' },
  { src: '/soft-glam-2.jpeg', alt: 'Soft Glam Elegance', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8865.JPG', alt: 'Professional Makeup Application', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8905.JPG', alt: 'Dramatic Runway Look', span: 'col-span-1 row-span-1' },
  { src: '/bridesmaid-glam.jpeg', alt: 'Bridesmaid Glam Perfection', span: 'col-span-1 row-span-2' },
  { src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', alt: 'Bridal Party Glam', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8869.JPG', alt: 'Special Event Makeup', span: 'col-span-1 row-span-1' },
  { src: '/smokey-eyes.jpg', alt: 'Smokey Eye Mastery', span: 'col-span-1 row-span-2' },
  { src: '/image1.jpeg', alt: 'Natural Beauty Enhancement', span: 'col-span-1 row-span-1' },
  { src: '/image2.jpeg', alt: 'Bridal Makeup Artistry', span: 'col-span-1 row-span-1' },
  { src: '/full-glam-2.jpeg', alt: 'Full Glam Transformation', span: 'col-span-1 row-span-2' },
  { src: '/image4.jpeg', alt: 'Elegant Event Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8949.JPG', alt: 'Sophisticated Glam Look', span: 'col-span-1 row-span-1' },
  { src: '/basic-softglam-cover.jpeg', alt: 'Basic Soft Glam Beauty', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8951.JPG', alt: 'Radiant Bridal Beauty', span: 'col-span-1 row-span-1' },
  { src: '/image6.jpeg', alt: 'Classic Glamour Makeup', span: 'col-span-1 row-span-1' },
  { src: '/signature-glam-cover.jpeg', alt: 'Signature Glam Cover Look', span: 'col-span-1 row-span-2' },
  { src: '/image8.jpeg', alt: 'Professional Beauty Artistry', span: 'col-span-1 row-span-1' },
  { src: '/image9.jpeg', alt: 'Dramatic Eye Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8863.JPG', alt: 'Behind the Scenes Makeup Session', span: 'col-span-1 row-span-1' },
  { src: '/IMG_9167.jpg', alt: 'Timeless Beauty Look', span: 'col-span-1 row-span-2' },
  { src: '/image11.jpeg', alt: 'Sophisticated Event Look', span: 'col-span-1 row-span-1' },
  { src: '/image0.jpeg', alt: 'Glamorous Evening Look', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8952.JPG', alt: 'Luxury Beauty Experience', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8953.JPG', alt: 'Editorial Glam Artistry', span: 'col-span-1 row-span-1' },
  { src: '/basic-softglam.jpeg', alt: 'Natural Soft Glam', span: 'col-span-1 row-span-1' },
  { src: '/image12.jpeg', alt: 'Radiant Bridal Glow', span: 'col-span-1 row-span-2' },
  { src: '/image13.jpeg', alt: 'Contemporary Glam Style', span: 'col-span-1 row-span-1' },
  { src: '/soft-glam-cover.jpg', alt: 'Soft Glam Cover Look', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8920.JPG', alt: 'Bold Editorial Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8957.JPG', alt: 'Glamorous Party Look', span: 'col-span-1 row-span-2' },
  { src: '/image15.jpeg', alt: 'Flawless Skin Perfection', span: 'col-span-1 row-span-1' },
  { src: '/image16.jpeg', alt: 'Bold Editorial Statement', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8958.JPG', alt: 'Refined Beauty Transformation', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8959.JPG', alt: 'Chic Modern Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image17.jpeg', alt: 'Luxurious Glam Look', span: 'col-span-1 row-span-1' },
  { src: '/image3.jpeg', alt: 'Editorial Fashion Statement', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8963.JPG', alt: 'Professional Makeup Excellence', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8964.JPG', alt: 'Stunning Transformation', span: 'col-span-1 row-span-1' },
  { src: '/image19.jpeg', alt: 'Elegant Evening Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image20.jpeg', alt: 'Radiant Beauty Look', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8965.JPG', alt: 'Artistic Glam Creation', span: 'col-span-1 row-span-1' },
  { src: '/full-glam.jpeg', alt: 'Full Glam Event Ready', span: 'col-span-1 row-span-1' },
  { src: '/image21.jpeg', alt: 'Classic Elegance Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image22.jpeg', alt: 'Modern Beauty Artistry', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8968.JPG', alt: 'Luxe Makeup Design', span: 'col-span-1 row-span-1' },
  { src: '/image23.jpeg', alt: 'Flawless Glam Finish', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8960.JPG', alt: 'High Fashion Editorial Look', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8955.JPG', alt: 'Evening Glam Dark Tones', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8950.JPG', alt: 'Bold Beauty Transformation', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8954.JPG', alt: 'Polished Evening Beauty', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8956.JPG', alt: 'Artistic Beauty Creation', span: 'col-span-1 row-span-2' },
  { src: '/image18.jpeg', alt: 'Sophisticated Beauty Style', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8966.JPG', alt: 'Polished Event Beauty', span: 'col-span-1 row-span-1' },
];

// Convert to GalleryImage format for admin management
const createFallbackImages = (): GalleryImage[] => {
  return galleryImageData.map((img, index) => {
    const fileName = img.src.split('/').pop() || '';
    return {
      id: `gallery-${index + 1}`,
      storage_path: fileName,
      thumbnail_path: null,
      file_name: fileName,
      file_size: 500000, // Approximate size
      mime_type: 'image/jpeg',
      width: 1200,
      height: img.span.includes('row-span-2') ? 1800 : 900,
      aspect_ratio: img.span.includes('row-span-2') ? 0.67 : 1.33,
      title: img.alt,
      description: `Professional makeup artistry - ${img.alt}`,
      alt_text: img.alt,
      category: 'special_events' as const,
      tags: ['makeup', 'glam', 'beauty', 'professional'],
      ai_tags: [],
      ai_description: null,
      ai_confidence: null,
      ai_processed_at: null,
      is_featured: index < 10, // First 10 are featured
      is_published: true,
      display_order: index,
      uploaded_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

const fallbackImages = createFallbackImages();

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
        const query = supabase
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

        if (!fetchError && data && data.length > 0) {
          dbImages = data as GalleryImage[];
        }
      } catch (dbError) {
        console.warn('Gallery database fetch failed, using local images');
      }

      // If no database images, use the beauty gallery fallback images
      let allImages = dbImages.length > 0 ? dbImages : fallbackImages;

      // Apply client-side filtering for fallback images
      if (dbImages.length === 0) {
        if (options.category) {
          allImages = allImages.filter(img => img.category === options.category);
        }

        if (options.filters?.is_featured !== undefined) {
          allImages = allImages.filter(img => img.is_featured === options.filters?.is_featured);
        }

        if (options.filters?.is_published !== undefined) {
          allImages = allImages.filter(img => img.is_published === options.filters?.is_published);
        }

        if (options.filters?.search) {
          const searchTerm = options.filters.search.toLowerCase();
          allImages = allImages.filter(img =>
            img.title?.toLowerCase().includes(searchTerm) ||
            img.description?.toLowerCase().includes(searchTerm) ||
            img.alt_text.toLowerCase().includes(searchTerm) ||
            img.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }

        // Apply pagination
        if (options.offset) {
          allImages = allImages.slice(options.offset);
        }
        if (options.limit) {
          allImages = allImages.slice(0, options.limit);
        }
      }

      setImages(allImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      // Still show fallback images on error
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.filters, options.limit, options.offset]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    try {
      // For local gallery images, just update local state
      if (id.startsWith('gallery-')) {
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
      // For local gallery images, just update local state
      if (id.startsWith('gallery-')) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast({
          title: 'Success',
          description: 'Image removed from gallery',
        });
        return true;
      }

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

      // For local gallery images, just update local state
      if (updates.some(u => u.id.startsWith('gallery-'))) {
        toast({
          title: 'Success',
          description: 'Images reordered successfully',
        });
        return true;
      }

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
