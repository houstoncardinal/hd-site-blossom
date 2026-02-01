import { useState, useEffect, useCallback, useMemo } from 'react';
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
  { src: '/IMG_8915.JPG', alt: 'Evening Glam Runway Look' },
  { src: '/full-glam-cover.jpeg', alt: 'Full Glam Makeup Artistry' },
  { src: '/IMG_8910.JPG', alt: 'Editorial Fashion Makeup' },
  { src: '/signature-glam.jpeg', alt: 'Signature Glam Experience' },
  { src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', alt: 'Elegant Evening Glam' },
  { src: '/IMG_8900.JPG', alt: 'Bridal Beauty Perfection' },
  { src: '/soft-glam-2.jpeg', alt: 'Soft Glam Elegance' },
  { src: '/IMG_8865.JPG', alt: 'Professional Makeup Application' },
  { src: '/IMG_8905.JPG', alt: 'Dramatic Runway Look' },
  { src: '/bridesmaid-glam.jpeg', alt: 'Bridesmaid Glam Perfection' },
  { src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', alt: 'Bridal Party Glam' },
  { src: '/IMG_8869.JPG', alt: 'Special Event Makeup' },
  { src: '/smokey-eyes.jpg', alt: 'Smokey Eye Mastery' },
  { src: '/image1.jpeg', alt: 'Natural Beauty Enhancement' },
  { src: '/image2.jpeg', alt: 'Bridal Makeup Artistry' },
  { src: '/full-glam-2.jpeg', alt: 'Full Glam Transformation' },
  { src: '/image4.jpeg', alt: 'Elegant Event Makeup' },
  { src: '/IMG_8949.JPG', alt: 'Sophisticated Glam Look' },
  { src: '/basic-softglam-cover.jpeg', alt: 'Basic Soft Glam Beauty' },
  { src: '/IMG_8951.JPG', alt: 'Radiant Bridal Beauty' },
  { src: '/image6.jpeg', alt: 'Classic Glamour Makeup' },
  { src: '/signature-glam-cover.jpeg', alt: 'Signature Glam Cover Look' },
  { src: '/image8.jpeg', alt: 'Professional Beauty Artistry' },
  { src: '/image9.jpeg', alt: 'Dramatic Eye Makeup' },
  { src: '/IMG_8863.JPG', alt: 'Behind the Scenes Makeup Session' },
  { src: '/IMG_9167.jpg', alt: 'Timeless Beauty Look' },
  { src: '/image11.jpeg', alt: 'Sophisticated Event Look' },
  { src: '/image0.jpeg', alt: 'Glamorous Evening Look' },
  { src: '/IMG_8952.JPG', alt: 'Luxury Beauty Experience' },
  { src: '/IMG_8953.JPG', alt: 'Editorial Glam Artistry' },
  { src: '/basic-softglam.jpeg', alt: 'Natural Soft Glam' },
  { src: '/image12.jpeg', alt: 'Radiant Bridal Glow' },
  { src: '/image13.jpeg', alt: 'Contemporary Glam Style' },
  { src: '/soft-glam-cover.jpg', alt: 'Soft Glam Cover Look' },
  { src: '/IMG_8920.JPG', alt: 'Bold Editorial Makeup' },
  { src: '/IMG_8957.JPG', alt: 'Glamorous Party Look' },
  { src: '/image15.jpeg', alt: 'Flawless Skin Perfection' },
  { src: '/IMG_8958.JPG', alt: 'Refined Beauty Transformation' },
  { src: '/IMG_8959.JPG', alt: 'Chic Modern Makeup' },
  { src: '/image17.jpeg', alt: 'Luxurious Glam Look' },
  { src: '/image3.jpeg', alt: 'Editorial Fashion Statement' },
  { src: '/IMG_8963.JPG', alt: 'Professional Makeup Excellence' },
  { src: '/IMG_8964.JPG', alt: 'Stunning Transformation' },
  { src: '/image19.jpeg', alt: 'Elegant Evening Makeup' },
  { src: '/image20.jpeg', alt: 'Radiant Beauty Look' },
  { src: '/IMG_8965.JPG', alt: 'Artistic Glam Creation' },
  { src: '/full-glam.jpeg', alt: 'Full Glam Event Ready' },
  { src: '/image21.jpeg', alt: 'Classic Elegance Makeup' },
  { src: '/image22.jpeg', alt: 'Modern Beauty Artistry' },
  { src: '/IMG_8968.JPG', alt: 'Luxe Makeup Design' },
  { src: '/image23.jpeg', alt: 'Flawless Glam Finish' },
  { src: '/IMG_8960.JPG', alt: 'High Fashion Editorial Look' },
  { src: '/IMG_8955.JPG', alt: 'Evening Glam Dark Tones' },
  { src: '/IMG_8950.JPG', alt: 'Bold Beauty Transformation' },
  { src: '/IMG_8954.JPG', alt: 'Polished Evening Beauty' },
  { src: '/IMG_8956.JPG', alt: 'Artistic Beauty Creation' },
  { src: '/image18.jpeg', alt: 'Sophisticated Beauty Style' },
  { src: '/IMG_8966.JPG', alt: 'Polished Event Beauty' },
];

// Convert to GalleryImage format for admin management
const createFallbackImages = (): GalleryImage[] => {
  return galleryImageData.map((img, index) => {
    const fileName = img.src.replace('/', '');
    return {
      id: `gallery-${index + 1}`,
      storage_path: fileName,
      thumbnail_path: null,
      file_name: fileName,
      file_size: 500000,
      mime_type: 'image/jpeg',
      width: 1200,
      height: 1200,
      aspect_ratio: 1,
      title: img.alt,
      description: `Professional makeup artistry - ${img.alt}`,
      alt_text: img.alt,
      category: 'special_events' as const,
      tags: ['makeup', 'glam', 'beauty', 'professional'],
      ai_tags: [],
      ai_description: null,
      ai_confidence: null,
      ai_processed_at: null,
      is_featured: index < 10,
      is_published: true,
      display_order: index,
      uploaded_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

// Memoize fallback images
const fallbackImages = createFallbackImages();

export function useGalleryImages(options: UseGalleryImagesOptions = {}) {
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Memoize options to prevent unnecessary re-fetches
  const stableOptions = useMemo(() => ({
    category: options.category,
    search: options.filters?.search,
    is_featured: options.filters?.is_featured,
    is_published: options.filters?.is_published,
    tags: options.filters?.tags?.join(','),
    limit: options.limit,
    offset: options.offset,
  }), [
    options.category,
    options.filters?.search,
    options.filters?.is_featured,
    options.filters?.is_published,
    options.filters?.tags,
    options.limit,
    options.offset,
  ]);

  const fetchImages = useCallback(async () => {
    // Don't show loading on initial render - show fallback immediately
    if (initialized) {
      setLoading(true);
    }
    setError(null);

    try {
      // Try to fetch from database
      let dbImages: GalleryImage[] = [];
      
      const query = supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      let filteredQuery = query;
      
      if (stableOptions.category) {
        filteredQuery = filteredQuery.eq('category', stableOptions.category);
      }

      if (stableOptions.is_featured !== undefined) {
        filteredQuery = filteredQuery.eq('is_featured', stableOptions.is_featured);
      }

      if (stableOptions.is_published !== undefined) {
        filteredQuery = filteredQuery.eq('is_published', stableOptions.is_published);
      }

      if (stableOptions.search) {
        filteredQuery = filteredQuery.or(
          `title.ilike.%${stableOptions.search}%,description.ilike.%${stableOptions.search}%,alt_text.ilike.%${stableOptions.search}%`
        );
      }

      if (stableOptions.limit) {
        filteredQuery = filteredQuery.limit(stableOptions.limit);
      }

      if (stableOptions.offset) {
        filteredQuery = filteredQuery.range(
          stableOptions.offset,
          stableOptions.offset + (stableOptions.limit || 50) - 1
        );
      }

      const { data, error: fetchError } = await filteredQuery;

      if (!fetchError && data && data.length > 0) {
        dbImages = data as GalleryImage[];
        setImages(dbImages);
      } else {
        // Apply client-side filtering to fallback images
        let filteredFallback = [...fallbackImages];

        if (stableOptions.category) {
          filteredFallback = filteredFallback.filter(img => img.category === stableOptions.category);
        }

        if (stableOptions.is_featured !== undefined) {
          filteredFallback = filteredFallback.filter(img => img.is_featured === stableOptions.is_featured);
        }

        if (stableOptions.is_published !== undefined) {
          filteredFallback = filteredFallback.filter(img => img.is_published === stableOptions.is_published);
        }

        if (stableOptions.search) {
          const searchTerm = stableOptions.search.toLowerCase();
          filteredFallback = filteredFallback.filter(img =>
            img.title?.toLowerCase().includes(searchTerm) ||
            img.description?.toLowerCase().includes(searchTerm) ||
            img.alt_text.toLowerCase().includes(searchTerm)
          );
        }

        if (stableOptions.offset) {
          filteredFallback = filteredFallback.slice(stableOptions.offset);
        }
        if (stableOptions.limit) {
          filteredFallback = filteredFallback.slice(0, stableOptions.limit);
        }

        setImages(filteredFallback);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      // Keep showing fallback images on error
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [stableOptions, initialized]);

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

      const { error: updateError } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

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

      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

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

      // Optimistically update local state immediately
      setImages(reorderedImages);

      // For local gallery images, just update local state
      if (reorderedImages.some(img => img.id.startsWith('gallery-'))) {
        toast({
          title: 'Success',
          description: 'Images reordered successfully',
        });
        return true;
      }

      // Update database
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        display_order: index,
      }));

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
