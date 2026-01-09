import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollections } from './hooks/useCollections';
import { Folder, Plus, MoreVertical, Edit, Trash2, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GalleryCollection } from '@/types/gallery';
import { getImageUrl } from '@/types/gallery';

export const CollectionManager = () => {
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<GalleryCollection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const { collections, loading, createCollection, updateCollection, deleteCollection } = useCollections();
  const { toast } = useToast();

  const handleOpenDialog = (collection?: GalleryCollection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
      });
    } else {
      setEditingCollection(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setCollectionDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCollectionDialogOpen(false);
    setEditingCollection(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Collection name is required',
        variant: 'destructive',
      });
      return;
    }

    // Auto-generate slug from name if not provided
    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const data = {
      name: formData.name.trim(),
      slug,
      description: formData.description.trim() || null,
    };

    let success = false;
    if (editingCollection) {
      success = await updateCollection(editingCollection.id, data);
    } else {
      success = await createCollection(data);
    }

    if (success) {
      toast({
        title: 'Success',
        description: `Collection ${editingCollection ? 'updated' : 'created'} successfully`,
      });
      handleCloseDialog();
    }
  };

  const handleDelete = async (collection: GalleryCollection) => {
    if (!confirm(`Are you sure you want to delete "${collection.name}"? This will not delete the images.`)) {
      return;
    }

    const success = await deleteCollection(collection.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="aspect-video w-full rounded" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <Folder className="h-6 w-6" />
            Collections
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Organize images into themed collections
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          New Collection
        </Button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Folder size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No collections yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Create your first collection to organize images
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={16} className="mr-2" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                <div className="aspect-video relative bg-muted">
                  {collection.cover_image_path ? (
                    <img
                      src={getImageUrl(collection.cover_image_path)}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={48} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{collection.name}</h3>
                      <p className="text-xs text-muted-foreground">/{collection.slug}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(collection)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(collection)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {collection.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {collection.image_count || 0} images
                    </Badge>
                    <span>•</span>
                    <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Collection Dialog */}
      <Dialog open={collectionDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Create Collection'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bridal Portfolio 2024"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
                <span className="text-xs text-muted-foreground ml-2">
                  (auto-generated if empty)
                </span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  })
                }
                placeholder="bridal-portfolio-2024"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this collection..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCollection ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
