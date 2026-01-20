import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryCategory, GalleryImageInsert } from '@/types/gallery';
import Compressor from 'compressorjs';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface UseImageUploadReturn {
  uploadImages: (files: File[], category: GalleryCategory) => Promise<boolean>;
  uploading: boolean;
  progress: number;
  uploadProgress: UploadProgress[];
}

const compressImage = (file: File): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 2400,
      maxHeight: 2400,
      convertTypes: ['image/png', 'image/webp'],
      convertSize: 1000000, // Convert to JPEG if > 1MB
      success: (result) => resolve(result),
      error: (error) => reject(error),
    });
  });
};

const generateAltText = (fileName: string, category: GalleryCategory): string => {
  const baseName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const categoryLabels: Record<GalleryCategory, string> = {
    bridal: 'Bridal Makeup',
    editorial: 'Editorial Makeup',
    evening_glam: 'Evening Glam Makeup',
    natural_beauty: 'Natural Beauty Makeup',
    special_events: 'Special Event Makeup',
    celebrity: 'Celebrity Makeup',
    before_after: 'Before and After Transformation',
    hair_styling: 'Hair Styling',
    special_fx: 'Special Effects Makeup',
  };

  return `${categoryLabels[category]} - ${baseName} - HDA Studio`;
};

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  const updateFileProgress = (
    fileName: string,
    updates: Partial<UploadProgress>
  ) => {
    setUploadProgress((prev) =>
      prev.map((p) => (p.fileName === fileName ? { ...p, ...updates } : p))
    );
  };

  const uploadImages = async (
    files: File[],
    category: GalleryCategory
  ): Promise<boolean> => {
    if (files.length === 0) return false;

    try {
      setUploading(true);
      setProgress(0);
      setUploadProgress(
        files.map((f) => ({
          fileName: f.name,
          progress: 0,
          status: 'uploading' as const,
        }))
      );

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      let successCount = 0;
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;

        try {
          updateFileProgress(fileName, { status: 'processing' });

          // Compress image
          const compressed = await compressImage(file);
          const compressedFile =
            compressed instanceof Blob
              ? new File([compressed], fileName, { type: compressed.type })
              : compressed;

          updateFileProgress(fileName, { status: 'uploading', progress: 20 });

          // Generate unique file path
          const timestamp = Date.now();
          const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storagePath = `${category}/${timestamp}-${cleanFileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(storagePath, compressedFile, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          updateFileProgress(fileName, { progress: 60 });

          // Get image dimensions
          const dimensions = await getImageDimensions(compressedFile);

          updateFileProgress(fileName, { progress: 80 });

          // Create database record
          const imageData: GalleryImageInsert = {
            storage_path: storagePath,
            file_name: fileName,
            file_size: compressedFile.size,
            mime_type: compressedFile.type,
            category,
            alt_text: generateAltText(fileName, category),
            width: dimensions.width,
            height: dimensions.height,
            aspect_ratio: dimensions.width && dimensions.height
              ? dimensions.width / dimensions.height
              : null,
            is_published: true,
            is_featured: false,
          };

          const { error: dbError } = await supabase
            .from('gallery_images')
            .insert({
              ...imageData,
              uploaded_by: userId,
            });

          if (dbError) throw dbError;

          updateFileProgress(fileName, { status: 'complete', progress: 100 });
          successCount++;
        } catch (error) {
          console.error(`Error uploading ${fileName}:`, error);
          updateFileProgress(fileName, {
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          });
        }

        setProgress(((i + 1) / totalFiles) * 100);
      }

      if (successCount === totalFiles) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} image(s).`,
        });
        return true;
      } else if (successCount > 0) {
        toast({
          title: 'Partial Upload',
          description: `Uploaded ${successCount} of ${totalFiles} image(s). Some files failed.`,
          variant: 'destructive',
        });
        return true;
      } else {
        toast({
          title: 'Upload Failed',
          description: 'No images were uploaded. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error in uploadImages:', error);
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred during upload.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading,
    progress,
    uploadProgress,
  };
}

function getImageDimensions(
  file: File | Blob
): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: null, height: null });
    };

    img.src = url;
  });
}
