import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGalleryImages } from './hooks/useGalleryImages';
import { useAITagging } from './hooks/useAITagging';
import { Sparkles, Play, Square, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { GalleryCategory } from '@/types/gallery';
import { GALLERY_CATEGORY_LABELS } from '@/types/gallery';

export const AITaggingPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [unprocessedOnly, setUnprocessedOnly] = useState(true);

  const { images, loading: loadingImages } = useGalleryImages({
    category: selectedCategory,
  });

  const { processing, progress, processBatch, clearProgress } = useAITagging();

  // Filter images based on selection
  const imagesToProcess = images.filter((img) => {
    if (unprocessedOnly) {
      return !img.ai_processed_at;
    }
    return true;
  });

  const progressPercentage = progress.length > 0
    ? (progress.filter((p) => p.status === 'complete' || p.status === 'error').length /
        progress.length) *
      100
    : 0;

  const successCount = progress.filter((p) => p.status === 'complete').length;
  const errorCount = progress.filter((p) => p.status === 'error').length;
  const processingCount = progress.filter((p) => p.status === 'processing').length;

  const handleStartProcessing = () => {
    if (imagesToProcess.length === 0) return;
    processBatch(imagesToProcess);
  };

  const handleStopProcessing = () => {
    // Stop would be complex - just clear progress for now
    clearProgress();
  };

  useEffect(() => {
    // Clear progress when switching categories
    clearProgress();
  }, [selectedCategory, unprocessedOnly]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          AI Auto-Tagging
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Automatically generate tags and descriptions using AI vision
        </p>
      </div>

      {/* Configuration Card */}
      <Card className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory || 'all'}
                onValueChange={(value) =>
                  setSelectedCategory(value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Process Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Process</label>
              <Select
                value={unprocessedOnly ? 'unprocessed' : 'all'}
                onValueChange={(value) => setUnprocessedOnly(value === 'unprocessed')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unprocessed">Unprocessed Only</SelectItem>
                  <SelectItem value="all">All Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Images:</span>
              <Badge variant="secondary">{images.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">To Process:</span>
              <Badge variant="default">{imagesToProcess.length}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!processing ? (
              <Button
                onClick={handleStartProcessing}
                disabled={loadingImages || imagesToProcess.length === 0}
                size="lg"
              >
                <Play size={16} className="mr-2" />
                Start Processing {imagesToProcess.length} Images
              </Button>
            ) : (
              <Button onClick={handleStopProcessing} variant="outline" size="lg">
                <Square size={16} className="mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Progress Section */}
      {progress.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Processing Progress</h3>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>{successCount} completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="text-blue-500 animate-spin" />
              <span>{processingCount} processing</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span>{errorCount} failed</span>
            </div>
          </div>

          {/* Progress Items */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {progress.map((item) => (
              <motion.div
                key={item.imageId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.status === 'processing' && (
                    <Loader2 size={16} className="text-blue-500 animate-spin flex-shrink-0" />
                  )}
                  {item.status === 'complete' && (
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.fileName}</p>
                    {item.status === 'complete' && item.confidence && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </p>
                    )}
                    {item.status === 'error' && item.error && (
                      <p className="text-xs text-red-500">{item.error}</p>
                    )}
                  </div>
                </div>
                {item.status === 'complete' && item.tags && (
                  <div className="flex flex-wrap gap-1 ml-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      {!processing && progress.length === 0 && (
        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">About AI Auto-Tagging</h3>
              <p className="text-sm text-muted-foreground">
                This feature uses OpenAI's GPT-4 Vision to analyze your images and automatically
                generate:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Relevant tags (makeup styles, techniques, colors, occasions)</li>
                <li>Professional descriptions for SEO and accessibility</li>
                <li>Confidence scores for each analysis</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Note: Processing is rate-limited to avoid API throttling. Large batches may take
                several minutes.
              </p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
