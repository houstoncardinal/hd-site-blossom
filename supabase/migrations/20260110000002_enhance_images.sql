-- Migration: Enhance Image Management
-- Description: Adds before/after pairing and service image management
-- Author: Enterprise Admin System
-- Date: 2026-01-10

-- Add before/after pairing to gallery images
ALTER TABLE public.gallery_images
ADD COLUMN before_after_pair_id UUID REFERENCES public.gallery_images(id) ON DELETE SET NULL,
ADD COLUMN is_before_image BOOLEAN DEFAULT NULL,
ADD COLUMN transformation_notes TEXT;

-- Create index for before/after queries
CREATE INDEX idx_gallery_images_before_after ON public.gallery_images(before_after_pair_id);

-- Create a view for before/after pairs
CREATE OR REPLACE VIEW public.before_after_pairs AS
SELECT
  b.id AS before_image_id,
  b.storage_path AS before_storage_path,
  b.thumbnail_path AS before_thumbnail_path,
  b.title AS before_title,
  b.created_at AS before_created_at,
  a.id AS after_image_id,
  a.storage_path AS after_storage_path,
  a.thumbnail_path AS after_thumbnail_path,
  a.title AS after_title,
  a.created_at AS after_created_at,
  COALESCE(b.transformation_notes, a.transformation_notes) AS transformation_notes,
  b.category,
  b.is_published,
  b.is_featured,
  b.display_order
FROM public.gallery_images b
INNER JOIN public.gallery_images a ON b.before_after_pair_id = a.id
WHERE b.is_before_image = true
  AND a.is_before_image = false;

-- Grant SELECT on view
GRANT SELECT ON public.before_after_pairs TO authenticated;
GRANT SELECT ON public.before_after_pairs TO anon;

-- Create a storage bucket for service images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for service images (public read)
CREATE POLICY "Service images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

-- Storage policy for service images (admin upload)
CREATE POLICY "Admins can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policy for service images (admin delete)
CREATE POLICY "Admins can delete service images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'service-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Function to link before/after images
CREATE OR REPLACE FUNCTION public.link_before_after_images(
  p_before_image_id UUID,
  p_after_image_id UUID,
  p_transformation_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update before image
  UPDATE public.gallery_images
  SET
    before_after_pair_id = p_after_image_id,
    is_before_image = true,
    transformation_notes = p_transformation_notes,
    category = 'before_after'
  WHERE id = p_before_image_id;

  -- Update after image
  UPDATE public.gallery_images
  SET
    before_after_pair_id = p_before_image_id,
    is_before_image = false,
    transformation_notes = p_transformation_notes,
    category = 'before_after'
  WHERE id = p_after_image_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unlink before/after images
CREATE OR REPLACE FUNCTION public.unlink_before_after_images(
  p_image_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_pair_id UUID;
BEGIN
  -- Get the pair ID
  SELECT before_after_pair_id INTO v_pair_id
  FROM public.gallery_images
  WHERE id = p_image_id;

  IF v_pair_id IS NULL THEN
    RETURN false;
  END IF;

  -- Unlink both images
  UPDATE public.gallery_images
  SET
    before_after_pair_id = NULL,
    is_before_image = NULL,
    transformation_notes = NULL
  WHERE id = p_image_id OR id = v_pair_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON COLUMN public.gallery_images.before_after_pair_id IS 'References the paired before/after image';
COMMENT ON COLUMN public.gallery_images.is_before_image IS 'true = before image, false = after image, null = not a before/after pair';
COMMENT ON COLUMN public.gallery_images.transformation_notes IS 'Description of the transformation between before and after';
COMMENT ON FUNCTION public.link_before_after_images IS 'Links two images as a before/after pair';
COMMENT ON FUNCTION public.unlink_before_after_images IS 'Unlinks a before/after pair';
COMMENT ON VIEW public.before_after_pairs IS 'View showing all before/after image pairs';
