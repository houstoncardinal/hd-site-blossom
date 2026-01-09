import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage } from '@/types/gallery';

interface AITaggingProgress {
  imageId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  tags?: string[];
  description?: string;
  confidence?: number;
  error?: string;
}

interface UseAITaggingReturn {
  processing: boolean;
  progress: AITaggingProgress[];
  processImage: (image: GalleryImage) => Promise<boolean>;
  processBatch: (images: GalleryImage[]) => Promise<void>;
  clearProgress: () => void;
}

export function useAITagging(): UseAITaggingReturn {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<AITaggingProgress[]>([]);
  const { toast } = useToast();

  const processImage = async (image: GalleryImage): Promise<boolean> => {
    try {
      // Add to progress
      setProgress((prev) => [
        ...prev,
        {
          imageId: image.id,
          fileName: image.file_name,
          status: 'processing',
        },
      ]);

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('process-gallery-image', {
        body: {
          imageId: image.id,
          storagePath: image.storage_path,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'AI processing failed');
      }

      // Update progress
      setProgress((prev) =>
        prev.map((p) =>
          p.imageId === image.id
            ? {
                ...p,
                status: 'complete',
                tags: data.tags,
                description: data.description,
                confidence: data.confidence,
              }
            : p
        )
      );

      return true;
    } catch (error: any) {
      console.error('Error processing image:', error);

      // Update progress with error
      setProgress((prev) =>
        prev.map((p) =>
          p.imageId === image.id
            ? {
                ...p,
                status: 'error',
                error: error.message || 'Unknown error',
              }
            : p
        )
      );

      toast({
        title: 'AI Processing Error',
        description: `Failed to process ${image.file_name}: ${error.message}`,
        variant: 'destructive',
      });

      return false;
    }
  };

  const processBatch = async (images: GalleryImage[]) => {
    setProcessing(true);
    setProgress([]);

    let successCount = 0;
    let failedCount = 0;

    // Process images sequentially to avoid rate limits
    for (const image of images) {
      // Skip if already processed
      if (image.ai_processed_at) {
        continue;
      }

      const success = await processImage(image);
      if (success) {
        successCount++;
      } else {
        failedCount++;
      }

      // Add delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setProcessing(false);

    // Show summary toast
    toast({
      title: 'Batch Processing Complete',
      description: `Successfully processed ${successCount} image(s). ${failedCount} failed.`,
    });
  };

  const clearProgress = () => {
    setProgress([]);
  };

  return {
    processing,
    progress,
    processImage,
    processBatch,
    clearProgress,
  };
}
