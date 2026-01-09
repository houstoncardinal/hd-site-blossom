import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from './ImageUploader';
import { ImageGrid } from './ImageGrid';
import { CategoryFilter } from './CategoryFilter';
import { useGalleryImages } from './hooks/useGalleryImages';
import { Image, Upload, Search, RefreshCw, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GalleryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { images, loading, updateImage, deleteImage, reorderImages, refetch } = useGalleryImages({
    category: selectedCategory || undefined,
    filters: {
      search: searchQuery || undefined,
    },
  });

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedImages.length} image(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    let successCount = 0;
    for (const imageId of selectedImages) {
      const image = images.find((img) => img.id === imageId);
      if (image) {
        const success = await deleteImage(image.id, image.storage_path);
        if (success) successCount++;
      }
    }

    setSelectedImages([]);
    toast({
      title: 'Bulk Delete Complete',
      description: `Successfully deleted ${successCount} of ${selectedImages.length} image(s)`,
    });
  };

  const handleBulkPublish = async (publish: boolean) => {
    if (selectedImages.length === 0) return;

    let successCount = 0;
    for (const imageId of selectedImages) {
      const success = await updateImage(imageId, { is_published: publish });
      if (success) successCount++;
    }

    toast({
      title: `Bulk ${publish ? 'Publish' : 'Unpublish'} Complete`,
      description: `Successfully ${publish ? 'published' : 'unpublished'} ${successCount} of ${selectedImages.length} image(s)`,
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-light flex items-center gap-2">
            <Image className="h-6 w-6" />
            Gallery Manager
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your gallery images with AI tagging and drag & drop
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload size={16} className="mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Image size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{images.length} Images</p>
            <p className="text-xs text-muted-foreground">Total in gallery</p>
          </div>
        </div>
        {selectedCategory && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedCategory.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>
        )}
        {selectedImages.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="default">{selectedImages.length} selected</Badge>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkPublish(true)}
          >
            <Eye size={16} className="mr-2" />
            Publish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkPublish(false)}
          >
            <EyeOff size={16} className="mr-2" />
            Unpublish
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Delete {selectedImages.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedImages([])}
            className="ml-auto"
          >
            Clear Selection
          </Button>
        </motion.div>
      )}

      {/* Image Grid */}
      <ImageGrid
        images={images}
        loading={loading}
        selectedImages={selectedImages}
        onSelectImages={setSelectedImages}
        onUpdate={updateImage}
        onDelete={deleteImage}
        onReorder={reorderImages}
      />

      {/* Upload Dialog */}
      <ImageUploader
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadComplete={refetch}
      />
    </motion.div>
  );
};
