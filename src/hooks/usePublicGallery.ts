import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryCategory, GALLERY_CATEGORY_LABELS } from '@/types/gallery';

export interface PublicGalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title?: string;
  description?: string;
  is_featured: boolean;
}

// Fallback images from public folder (same as before)
const fallbackImages: PublicGalleryImage[] = [
  { id: 'img-8915', src: '/IMG_8915.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8910', src: '/IMG_8910.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8900', src: '/IMG_8900.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8905', src: '/IMG_8905.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8920', src: '/IMG_8920.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8960', src: '/IMG_8960.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8955', src: '/IMG_8955.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-115a82f7', src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-13715236', src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', category: 'Bridal', alt: 'Bridal makeup look', is_featured: false },
  { id: 'img-8863', src: '/IMG_8863.JPG', category: 'Behind the Scenes', alt: 'Behind the Scenes makeup look', is_featured: false },
  { id: 'img-8865', src: '/IMG_8865.JPG', category: 'Behind the Scenes', alt: 'Behind the Scenes makeup look', is_featured: false },
  { id: 'img-8869', src: '/IMG_8869.JPG', category: 'Special Event', alt: 'Special Event makeup look', is_featured: false },
  { id: 'img-8901', src: '/IMG_8901.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8902', src: '/IMG_8902.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8903', src: '/IMG_8903.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8904', src: '/IMG_8904.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8909', src: '/IMG_8909.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8911', src: '/IMG_8911.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8912', src: '/IMG_8912.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8913', src: '/IMG_8913.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8914', src: '/IMG_8914.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8916', src: '/IMG_8916.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8918', src: '/IMG_8918.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8919', src: '/IMG_8919.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8949', src: '/IMG_8949.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8950', src: '/IMG_8950.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8951', src: '/IMG_8951.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8952', src: '/IMG_8952.JPG', category: 'Special Event', alt: 'Special Event makeup look', is_featured: false },
  { id: 'img-8953', src: '/IMG_8953.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8954', src: '/IMG_8954.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8956', src: '/IMG_8956.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8957', src: '/IMG_8957.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8958', src: '/IMG_8958.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8959', src: '/IMG_8959.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8963', src: '/IMG_8963.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8964', src: '/IMG_8964.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-8965', src: '/IMG_8965.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-8966', src: '/IMG_8966.JPG', category: 'Special Event', alt: 'Special Event makeup look', is_featured: false },
  { id: 'img-8968', src: '/IMG_8968.JPG', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'img-9166', src: '/IMG_9166.jpg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'img-9167', src: '/IMG_9167.jpg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image0', src: '/image0.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image1', src: '/image1.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image2', src: '/image2.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image3', src: '/image3.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image4', src: '/image4.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image6', src: '/image6.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image7', src: '/image7.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image8', src: '/image8.jpeg', category: 'Special Event', alt: 'Special Event makeup look', is_featured: false },
  { id: 'image9', src: '/image9.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image10', src: '/image10.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image11', src: '/image11.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image12', src: '/image12.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image13', src: '/image13.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image14', src: '/image14.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image15', src: '/image15.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image16', src: '/image16.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image17', src: '/image17.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image18', src: '/image18.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image19', src: '/image19.jpeg', category: 'Special Event', alt: 'Special Event makeup look', is_featured: false },
  { id: 'image20', src: '/image20.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image21', src: '/image21.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
  { id: 'image22', src: '/image22.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look', is_featured: false },
  { id: 'image23', src: '/image23.jpeg', category: 'Editorial', alt: 'Editorial makeup look', is_featured: false },
];

export const usePublicGallery = (selectedCategory?: string) => {
  const [images, setImages] = useState<PublicGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = (supabase as any)
        .from('gallery_images')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Filter by category if specified
      if (selectedCategory && selectedCategory !== 'All') {
        // Map display category names back to database values
        const categoryMap: Record<string, GalleryCategory> = {
          'Bridal': 'bridal',
          'Editorial': 'editorial',
          'Evening Glam': 'evening_glam',
          'Natural Beauty': 'natural_beauty',
          'Special Events': 'special_events',
          'Celebrity': 'celebrity',
          'Before & After': 'before_after',
          'Hair Styling': 'hair_styling',
          'Special FX': 'special_fx',
        };

        const dbCategory = categoryMap[selectedCategory];
        if (dbCategory) {
          query = query.eq('category', dbCategory);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Database query failed, falling back to static images:', error);
        // Fall back to static images
        const filteredFallback = selectedCategory && selectedCategory !== 'All'
          ? fallbackImages.filter(img => img.category === selectedCategory)
          : fallbackImages;
        setImages(filteredFallback);
        return;
      }

      const formattedImages: PublicGalleryImage[] = (data || []).map((img: any) => ({
        id: img.id,
        src: img.storage_path.startsWith('IMG_') || img.storage_path.startsWith('image') || img.storage_path.includes('.jpg') || img.storage_path.includes('.jpeg')
          ? `/${img.storage_path}`
          : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery-images/${img.storage_path}`,
        alt: img.alt_text || img.title || `${GALLERY_CATEGORY_LABELS[img.category]} makeup look`,
        category: GALLERY_CATEGORY_LABELS[img.category],
        title: img.title || undefined,
        description: img.description || undefined,
        is_featured: img.is_featured,
      }));

      // If no images from database, use fallback
      if (formattedImages.length === 0) {
        console.log('No images in database, using fallback images');
        const filteredFallback = selectedCategory && selectedCategory !== 'All'
          ? fallbackImages.filter(img => img.category === selectedCategory)
          : fallbackImages;
        setImages(filteredFallback);
      } else {
        setImages(formattedImages);
      }
    } catch (err) {
      console.error('Error fetching gallery images, using fallback:', err);
      // Use fallback images on error
      const filteredFallback = selectedCategory && selectedCategory !== 'All'
        ? fallbackImages.filter(img => img.category === selectedCategory)
        : fallbackImages;
      setImages(filteredFallback);
      setError(null); // Don't show error since we have fallback
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, error, refetch: fetchImages };
};
