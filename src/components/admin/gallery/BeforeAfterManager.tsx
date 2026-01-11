import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { useBeforeAfterPairs } from './hooks/useBeforeAfterPairs';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  ArrowRight,
  Unlink,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BeforeAfterImage {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  title: string | null;
}

interface BeforeAfterPair {
  before_image_id: string;
  before_storage_path: string;
  before_thumbnail_path: string | null;
  before_title: string | null;
  after_image_id: string;
  after_storage_path: string;
  after_thumbnail_path: string | null;
  after_title: string | null;
  transformation_notes: string | null;
  is_featured: boolean;
  is_published: boolean;
}

export const BeforeAfterManager = () => {
  const [pairingDialogOpen, setPairingDialogOpen] = useState(false);
  const [editPairDialogOpen, setEditPairDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeforeImage, setSelectedBeforeImage] = useState<string | null>(null);
  const [selectedAfterImage, setSelectedAfterImage] = useState<string | null>(null);
  const [transformationNotes, setTransformationNotes] = useState('');
  const [editingPair, setEditingPair] = useState<BeforeAfterPair | null>(null);
  const [availableImages, setAvailableImages] = useState<BeforeAfterImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const { pairs, loading, linkPair, unlinkPair, updatePair, refetch } = useBeforeAfterPairs();
  const { toast } = useToast();

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    const { data } = supabase.storage.from('gallery-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const loadAvailableImages = async () => {
    setLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('id, storage_path, thumbnail_path, title')
        .is('before_after_pair_id', null)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableImages(data || []);
    } catch (error: any) {
      console.error('Error loading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available images',
        variant: 'destructive',
      });
    } finally {
      setLoadingImages(false);
    }
  };

  const handleOpenPairingDialog = async () => {
    await loadAvailableImages();
    setSelectedBeforeImage(null);
    setSelectedAfterImage(null);
    setTransformationNotes('');
    setPairingDialogOpen(true);
  };

  const handleCreatePair = async () => {
    if (!selectedBeforeImage || !selectedAfterImage) {
      toast({
        title: 'Validation Error',
        description: 'Please select both before and after images',
        variant: 'destructive',
      });
      return;
    }

    const success = await linkPair(
      selectedBeforeImage,
      selectedAfterImage,
      transformationNotes.trim() || null
    );

    if (success) {
      toast({
        title: 'Success',
        description: 'Before/After pair created successfully',
      });
      setPairingDialogOpen(false);
      refetch();
    }
  };

  const handleEditPair = (pair: BeforeAfterPair) => {
    setEditingPair(pair);
    setTransformationNotes(pair.transformation_notes || '');
    setEditPairDialogOpen(true);
  };

  const handleUpdatePair = async () => {
    if (!editingPair) return;

    const success = await updatePair(
      editingPair.before_image_id,
      transformationNotes.trim() || null
    );

    if (success) {
      toast({
        title: 'Success',
        description: 'Transformation notes updated',
      });
      setEditPairDialogOpen(false);
      refetch();
    }
  };

  const handleUnlinkPair = async (pair: BeforeAfterPair) => {
    if (!confirm('Are you sure you want to unlink this before/after pair?')) {
      return;
    }

    const success = await unlinkPair(pair.before_image_id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Before/After pair unlinked successfully',
      });
      refetch();
    }
  };

  const filteredPairs = pairs.filter((pair) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pair.before_title?.toLowerCase().includes(query) ||
      pair.after_title?.toLowerCase().includes(query) ||
      pair.transformation_notes?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
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
        <Button onClick={handleOpenPairingDialog}>
          <Plus size={16} className="mr-2" />
          Create Pair
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transformations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{pairs.length} pairs</Badge>
      </div>

      {/* Pairs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading before/after pairs...</p>
        </div>
      ) : filteredPairs.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No before/after pairs found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first transformation pair'}
          </p>
          {!searchQuery && (
            <Button onClick={handleOpenPairingDialog}>
              <Plus size={16} className="mr-2" />
              Create Pair
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPairs.map((pair) => (
            <motion.div
              key={pair.before_image_id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Before/After Images */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Before */}
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="text-xs">
                        Before
                      </Badge>
                    </div>
                    <img
                      src={getImageUrl(pair.before_thumbnail_path || pair.before_storage_path)!}
                      alt="Before"
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* After */}
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="default" className="text-xs">
                        After
                      </Badge>
                    </div>
                    <img
                      src={getImageUrl(pair.after_thumbnail_path || pair.after_storage_path)!}
                      alt="After"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Transformation Notes */}
                  {pair.transformation_notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pair.transformation_notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      {pair.is_featured && (
                        <Badge variant="outline" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {!pair.is_published && (
                        <Badge variant="secondary" className="text-xs">
                          Unpublished
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
                        <DropdownMenuItem onClick={() => handleEditPair(pair)}>
                          <Edit size={16} className="mr-2" />
                          Edit Notes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleUnlinkPair(pair)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Unlink size={16} className="mr-2" />
                          Unlink Pair
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Pair Dialog */}
      <Dialog open={pairingDialogOpen} onOpenChange={setPairingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Before & After Pair</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Before Image Selection */}
            <div className="space-y-2">
              <Label>Select Before Image *</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {loadingImages ? (
                  <div className="col-span-full text-center py-8">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : availableImages.length === 0 ? (
                  <p className="col-span-full text-sm text-muted-foreground text-center py-8">
                    No unpaired images available
                  </p>
                ) : (
                  availableImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedBeforeImage(image.id)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedBeforeImage === image.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-muted-foreground/50'
                      }`}
                    >
                      <img
                        src={getImageUrl(image.thumbnail_path || image.storage_path)!}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-20 object-cover"
                      />
                      {selectedBeforeImage === image.id && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <Badge variant="default" className="text-xs">
                            Before
                          </Badge>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* After Image Selection */}
            <div className="space-y-2">
              <Label>Select After Image *</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {loadingImages ? (
                  <div className="col-span-full text-center py-8">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : availableImages.length === 0 ? (
                  <p className="col-span-full text-sm text-muted-foreground text-center py-8">
                    No unpaired images available
                  </p>
                ) : (
                  availableImages
                    .filter((img) => img.id !== selectedBeforeImage)
                    .map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedAfterImage(image.id)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedAfterImage === image.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent hover:border-muted-foreground/50'
                        }`}
                      >
                        <img
                          src={getImageUrl(image.thumbnail_path || image.storage_path)!}
                          alt={image.title || 'Gallery image'}
                          className="w-full h-20 object-cover"
                        />
                        {selectedAfterImage === image.id && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <Badge variant="default" className="text-xs">
                              After
                            </Badge>
                          </div>
                        )}
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Transformation Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Transformation Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={transformationNotes}
                onChange={(e) => setTransformationNotes(e.target.value)}
                placeholder="Describe the transformation (e.g., Full glam makeup with airbrush foundation...)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPairingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePair}
              disabled={!selectedBeforeImage || !selectedAfterImage}
            >
              Create Pair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pair Dialog */}
      <Dialog open={editPairDialogOpen} onOpenChange={setEditPairDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transformation Notes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Transformation Notes</Label>
              <Textarea
                id="edit-notes"
                value={transformationNotes}
                onChange={(e) => setTransformationNotes(e.target.value)}
                placeholder="Describe the transformation..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPairDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePair}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
