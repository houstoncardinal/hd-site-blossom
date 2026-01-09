import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ImageCard } from './ImageCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { GalleryImage } from '@/types/gallery';

interface ImageGridProps {
  images: GalleryImage[];
  loading: boolean;
  selectedImages: string[];
  onSelectImages: (ids: string[]) => void;
  onUpdate: (id: string, updates: Partial<GalleryImage>) => Promise<boolean>;
  onDelete: (id: string, storagePath: string) => Promise<boolean>;
  onReorder: (startIndex: number, endIndex: number) => Promise<boolean>;
}

export const ImageGrid = ({
  images,
  loading,
  selectedImages,
  onSelectImages,
  onUpdate,
  onDelete,
  onReorder,
}: ImageGridProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const imageIds = useMemo(() => images.map((img) => img.id), [images]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageIds.indexOf(active.id as string);
      const newIndex = imageIds.indexOf(over.id as string);

      await onReorder(oldIndex, newIndex);
    }
  };

  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      onSelectImages(selectedImages.filter((imgId) => imgId !== id));
    } else {
      onSelectImages([...selectedImages, id]);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">No images found</h3>
        <p className="text-muted-foreground mt-1">
          Upload some images to get started
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={imageIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isSelected={selectedImages.includes(image.id)}
              onToggleSelect={() => toggleImageSelection(image.id)}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
