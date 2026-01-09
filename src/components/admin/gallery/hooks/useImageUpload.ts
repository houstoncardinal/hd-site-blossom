import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Compressor from 'compressorjs';
import type { GalleryCategory, GalleryImageInsert } from '@/types/gallery';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
        success: (result) => {
          const compressedFile = new File([result], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        error: reject,
      });
    });
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  };

  const uploadSingleImage = async (
    file: File,
    category: GalleryCategory,
    index: number,
    total: number
  ): Promise<boolean> => {
    const fileName = file.name;

    try {
      // Update progress
      setUploadProgress((prev) => [
        ...prev.filter((p) => p.fileName !== fileName),
        { fileName, progress: 0, status: 'uploading' },
      ]);

      // Compress image
      const compressedFile = await compressImage(file);

      // Get image dimensions
      const { width, height } = await getImageDimensions(compressedFile);

      // Generate unique storage path
      const fileExt = fileName.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const storagePath = `${category}/${timestamp}-${randomString}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(storagePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploadProgress((prev) =>
        prev.map((p) =>
          p.fileName === fileName
            ? { ...p, progress: 50, status: 'processing' }
            : p
        )
      );

      // Create database record
      const imageData: GalleryImageInsert = {
        storage_path: uploadData.path,
        file_name: fileName,
        file_size: compressedFile.size,
        mime_type: compressedFile.type,
        alt_text: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category,
        width,
        height,
        aspect_ratio: Number((width / height).toFixed(2)),
        is_published: true,
      };

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert(imageData);

      if (dbError) {
        // Cleanup storage if database insert fails
        await supabase.storage.from('gallery-images').remove([storagePath]);
        throw dbError;
      }

      // Update progress
      setUploadProgress((prev) =>
        prev.map((p) =>
          p.fileName === fileName
            ? { ...p, progress: 100, status: 'complete' }
            : p
        )
      );

      // Update overall progress
      const overallProgress = Math.round(((index + 1) / total) * 100);
      setProgress(overallProgress);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';

      setUploadProgress((prev) =>
        prev.map((p) =>
          p.fileName === fileName
            ? { ...p, status: 'error', error: errorMessage }
            : p
        )
      );

      return false;
    }
  };

  const uploadImages = async (files: File[], category: GalleryCategory) => {
    try {
      setUploading(true);
      setProgress(0);
      setUploadProgress([]);

      const results = await Promise.all(
        files.map((file, index) =>
          uploadSingleImage(file, category, index, files.length)
        )
      );

      const successCount = results.filter(Boolean).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} image(s)${
            failCount > 0 ? `, ${failCount} failed` : ''
          }`,
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: 'All uploads failed. Please try again.',
          variant: 'destructive',
        });
      }

      return successCount > 0;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setProgress(0);
        setUploadProgress([]);
      }, 3000);
    }
  };

  return {
    uploadImages,
    uploading,
    progress,
    uploadProgress,
  };
}
