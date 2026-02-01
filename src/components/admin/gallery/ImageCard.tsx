import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GripVertical,
  MoreVertical,
  Eye,
  EyeOff,
  Star,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import type { GalleryImage } from '@/types/gallery';
import { getImageUrl } from '@/types/gallery';
import { cn } from '@/lib/utils';
import { ImageDetailDialog } from './ImageDetailDialog';

interface ImageCardProps {
  image: GalleryImage;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (id: string, updates: Partial<GalleryImage>) => Promise<boolean>;
  onDelete: (id: string, storagePath: string) => Promise<boolean>;
}

export const ImageCard = ({
  image,
  isSelected,
  onToggleSelect,
  onUpdate,
  onDelete,
}: ImageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl = getImageUrl(image.storage_path);

  const handleToggleFeatured = async () => {
    await onUpdate(image.id, { is_featured: !image.is_featured });
  };

  const handleTogglePublished = async () => {
    await onUpdate(image.id, { is_published: !image.is_published });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${image.title || image.file_name}"?`)) {
      return;
    }

    setIsDeleting(true);
    await onDelete(image.id, image.storage_path);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(imageUrl);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'relative group',
          isDragging && 'opacity-50',
          isDeleting && 'opacity-50 pointer-events-none'
        )}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="bg-white/90 backdrop-blur-sm border-2"
            />
          </div>

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="p-1 bg-white/90 backdrop-blur-sm rounded">
              <GripVertical size={16} className="text-muted-foreground" />
            </div>
          </div>

          {/* Image */}
          <div className="aspect-square relative bg-muted overflow-hidden">
            <img
              src={imageUrl}
              alt={image.alt_text}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <p className="text-white text-sm font-medium text-center line-clamp-2">
                {image.title || image.file_name}
              </p>
            </div>
          </div>

          {/* Simple Info Bar - No labels or tags */}
          <div className="p-2 flex items-center justify-end gap-1">
            {image.is_featured && (
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
            )}
            {!image.is_published && (
              <EyeOff size={14} className="text-muted-foreground" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleFeatured}>
                  <Star size={16} className="mr-2" />
                  {image.is_featured ? 'Unfeature' : 'Feature'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublished}>
                  {image.is_published ? (
                    <>
                      <EyeOff size={16} className="mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="mr-2" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyUrl}>
                  <Copy size={16} className="mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDetailDialogOpen(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </motion.div>

      {/* Image Detail Dialog */}
      <ImageDetailDialog
        image={image}
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        onUpdate={onUpdate}
      />
    </div>
  );
};
