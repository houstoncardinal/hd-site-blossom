-- Add unique constraint on storage_path for deduplication
CREATE UNIQUE INDEX IF NOT EXISTS gallery_images_storage_path_key ON public.gallery_images (storage_path);