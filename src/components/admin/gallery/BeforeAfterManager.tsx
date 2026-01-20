import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowRight, Plus, MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useBeforeAfterPairs, type BeforeAfterPairInsert } from '@/hooks/useBeforeAfterPairs';
import { useGalleryImages } from './hooks/useGalleryImages';
import { getImageUrl } from '@/types/gallery';

export const BeforeAfterManager = () => {
  const { pairs, loading, createPair, updatePair, deletePair } = useBeforeAfterPairs();
  const { images } = useGalleryImages({ filters: { is_published: true } });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPair, setEditingPair] = useState<string | null>(null);
  const [formData, setFormData] = useState<BeforeAfterPairInsert>({
    before_image_id: '',
    after_image_id: '',
    title: '',
    description: '',
    service_type: '',
  });

  const handleOpenDialog = (pairId?: string) => {
    if (pairId) {
      const pair = pairs.find((p) => p.id === pairId);
      if (pair) {
        setEditingPair(pairId);
        setFormData({
          before_image_id: pair.before_image_id,
          after_image_id: pair.after_image_id,
          title: pair.title || '',
          description: pair.description || '',
          service_type: pair.service_type || '',
        });
      }
    } else {
      setEditingPair(null);
      setFormData({
        before_image_id: '',
        after_image_id: '',
        title: '',
        description: '',
        service_type: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPair(null);
  };

  const handleSave = async () => {
    if (!formData.before_image_id || !formData.after_image_id) return;

    let success = false;
    if (editingPair) {
      success = await updatePair(editingPair, formData);
    } else {
      success = await createPair(formData);
    }

    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this before/after pair?')) return;
    await deletePair(id);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await updatePair(id, { is_published: !currentStatus });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="aspect-[2/1] w-full rounded" />
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Before & After Gallery
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase transformations with before and after image pairs
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} disabled={images.length < 2}>
          <Plus size={16} className="mr-2" />
          Add Pair
        </Button>
      </div>

      {/* Grid */}
      {pairs.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <ArrowRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Before/After Pairs Yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {images.length < 2
                ? 'Upload at least 2 images to the gallery first.'
                : 'Create your first before/after pair to showcase transformations.'}
            </p>
            {images.length >= 2 && (
              <Button onClick={() => handleOpenDialog()}>
                <Plus size={16} className="mr-2" />
                Create First Pair
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairs.map((pair) => (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Before/After Preview */}
                <div className="aspect-[2/1] relative bg-muted grid grid-cols-2">
                  <div className="relative">
                    {pair.before_image ? (
                      <img
                        src={getImageUrl(pair.before_image.storage_path)}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        Before
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    {pair.after_image ? (
                      <img
                        src={getImageUrl(pair.after_image.storage_path)}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        After
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {pair.title || 'Untitled Transformation'}
                      </h4>
                      {pair.service_type && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {pair.service_type}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(pair.id)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(pair.id, pair.is_published)}
                        >
                          {pair.is_published ? (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(pair.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {pair.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pair.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={pair.is_published ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {pair.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <span>•</span>
                    <span>{new Date(pair.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPair ? 'Edit Before/After Pair' : 'Create Before/After Pair'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Before Image */}
            <div className="space-y-2">
              <Label>Before Image *</Label>
              <Select
                value={formData.before_image_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, before_image_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select before image" />
                </SelectTrigger>
                <SelectContent>
                  {images.map((img) => (
                    <SelectItem key={img.id} value={img.id}>
                      {img.title || img.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* After Image */}
            <div className="space-y-2">
              <Label>After Image *</Label>
              <Select
                value={formData.after_image_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, after_image_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select after image" />
                </SelectTrigger>
                <SelectContent>
                  {images.map((img) => (
                    <SelectItem key={img.id} value={img.id}>
                      {img.title || img.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Bridal Transformation"
              />
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Input
                id="service_type"
                value={formData.service_type}
                onChange={(e) =>
                  setFormData({ ...formData, service_type: e.target.value })
                }
                placeholder="e.g., Bridal, Editorial, Glam"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the transformation..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.before_image_id || !formData.after_image_id}
            >
              {editingPair ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
