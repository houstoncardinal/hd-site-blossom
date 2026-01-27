import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, X, Tag, Star, Eye } from 'lucide-react';
import type { GalleryImage, GalleryCategory } from '@/types/gallery';
import { GALLERY_CATEGORY_LABELS, getImageUrl } from '@/types/gallery';
import { useToast } from '@/hooks/use-toast';

interface ImageDetailDialogProps {
  image: GalleryImage | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<GalleryImage>) => Promise<boolean>;
}

export const ImageDetailDialog = ({
  image,
  open,
  onClose,
  onUpdate,
}: ImageDetailDialogProps) => {
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || '',
        description: image.description || '',
        alt_text: image.alt_text,
        category: image.category,
        tags: image.tags,
        is_featured: image.is_featured,
        is_published: image.is_published,
      });
    }
  }, [image]);

  const handleSave = async () => {
    if (!image) return;

    setSaving(true);
    const success = await onUpdate(image.id, formData);
    setSaving(false);

    if (success) {
      toast({
        title: 'Success',
        description: 'Image details updated successfully',
      });
      onClose();
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    const currentTags = formData.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...currentTags, newTag.trim()],
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tag),
    });
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Image Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              <img
                src={getImageUrl(image.storage_path)}
                alt={image.alt_text}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span>
                  {image.width} × {image.height}px
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">File Size:</span>
                <span>{(image.file_size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Format:</span>
                <span>{image.mime_type.split('/')[1].toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Uploaded:</span>
                <span>{new Date(image.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* AI Tags */}
            {image.ai_tags.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500" />
                  AI-Generated Tags
                </Label>
                <div className="flex flex-wrap gap-1">
                  {image.ai_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {image.ai_confidence && (
                  <p className="text-xs text-muted-foreground">
                    Confidence: {(image.ai_confidence * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter image title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter image description..."
                rows={3}
              />
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="alt_text">Alt Text (for SEO)</Label>
              <Input
                id="alt_text"
                value={formData.alt_text || ''}
                onChange={(e) =>
                  setFormData({ ...formData, alt_text: e.target.value })
                }
                placeholder="Describe the image for accessibility..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as GalleryCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag size={14} />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                />
                <Button onClick={handleAddTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(formData.tags || []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer hover:bg-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="flex items-center gap-2">
                  <Star size={14} />
                  Featured Image
                </Label>
                <Switch
                  id="featured"
                  checked={formData.is_featured || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="flex items-center gap-2">
                  <Eye size={14} />
                  Published
                </Label>
                <Switch
                  id="published"
                  checked={formData.is_published !== false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
