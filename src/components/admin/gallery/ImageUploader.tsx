import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageUpload } from './hooks/useImageUpload';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryCategory } from '@/types/gallery';
import { GALLERY_CATEGORY_LABELS } from '@/types/gallery';

interface ImageUploaderProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const ImageUploader = ({ open, onClose, onUploadComplete }: ImageUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<GalleryCategory>('editorial');
  const { uploadImages, uploading, progress, uploadProgress } = useImageUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxSize: 10485760, // 10MB
    disabled: uploading,
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const success = await uploadImages(selectedFiles, category);
    if (success) {
      setSelectedFiles([]);
      onUploadComplete();
      setTimeout(() => onClose(), 1000);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={20} />
            Upload Gallery Images
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as GalleryCategory)}
              disabled={uploading}
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

          {/* Dropzone */}
          {!uploading && (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary font-medium">Drop the images here...</p>
              ) : (
                <div>
                  <p className="font-medium">Drag & drop images here, or click to select</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, JPEG, WebP up to 10MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Images will be automatically compressed and optimized
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && !uploading && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {selectedFiles.length} file(s) selected
              </p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-secondary rounded"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Uploading images...</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />

              {/* Individual File Progress */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadProgress.map((fileProgress) => (
                  <div
                    key={fileProgress.fileName}
                    className="flex items-center gap-2 p-2 bg-secondary rounded text-sm"
                  >
                    {fileProgress.status === 'complete' && (
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    )}
                    {fileProgress.status === 'error' && (
                      <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                    )}
                    {(fileProgress.status === 'uploading' ||
                      fileProgress.status === 'processing') && (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                    <span className="truncate flex-1">{fileProgress.fileName}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {fileProgress.status === 'complete' && 'Done'}
                      {fileProgress.status === 'uploading' && 'Uploading...'}
                      {fileProgress.status === 'processing' && 'Processing...'}
                      {fileProgress.status === 'error' && 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Cancel'}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading {selectedFiles.length} image(s)...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
