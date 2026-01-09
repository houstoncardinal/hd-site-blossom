-- Migration: Gallery System
-- Description: Creates tables for gallery images, collections, and AI tagging
-- Author: Enterprise Admin System
-- Date: 2026-01-08

-- Gallery categories enum
CREATE TYPE gallery_category AS ENUM (
  'bridal',
  'editorial',
  'evening_glam',
  'natural_beauty',
  'special_events',
  'celebrity',
  'before_after',
  'hair_styling',
  'special_fx'
);

-- Gallery images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File information
  storage_path TEXT NOT NULL UNIQUE,
  thumbnail_path TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,

  -- Image metadata
  width INTEGER,
  height INTEGER,
  aspect_ratio DECIMAL(5,2),

  -- Organization
  title TEXT,
  description TEXT,
  alt_text TEXT NOT NULL,
  category gallery_category NOT NULL DEFAULT 'editorial',
  tags TEXT[] DEFAULT '{}',

  -- AI-generated metadata
  ai_tags TEXT[] DEFAULT '{}',
  ai_description TEXT,
  ai_confidence DECIMAL(3,2),
  ai_processed_at TIMESTAMP WITH TIME ZONE,

  -- Display settings
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  CONSTRAINT valid_confidence CHECK (ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 1))
);

-- Create indexes for performance
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_published ON public.gallery_images(is_published);
CREATE INDEX idx_gallery_images_featured ON public.gallery_images(is_featured);
CREATE INDEX idx_gallery_images_order ON public.gallery_images(display_order);
CREATE INDEX idx_gallery_images_tags ON public.gallery_images USING GIN(tags);
CREATE INDEX idx_gallery_images_ai_tags ON public.gallery_images USING GIN(ai_tags);

-- Gallery image collections (for organizing related images)
CREATE TABLE public.gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_image_id UUID REFERENCES public.gallery_images(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Many-to-many relationship between images and collections
CREATE TABLE public.gallery_collection_images (
  collection_id UUID REFERENCES public.gallery_collections(id) ON DELETE CASCADE,
  image_id UUID REFERENCES public.gallery_images(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (collection_id, image_id)
);

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collection_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_images
CREATE POLICY "Published images are publicly viewable"
  ON public.gallery_images FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can do everything with gallery images"
  ON public.gallery_images FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for collections
CREATE POLICY "Published collections are publicly viewable"
  ON public.gallery_collections FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage collections"
  ON public.gallery_collections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for collection images
CREATE POLICY "Public can view collection images"
  ON public.gallery_collection_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage collection images"
  ON public.gallery_collection_images FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on gallery_images
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on gallery_collections
CREATE TRIGGER update_gallery_collections_updated_at
  BEFORE UPDATE ON public.gallery_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create Supabase Storage buckets via SQL (alternative to dashboard)
-- Note: These INSERT statements may fail if buckets already exist - that's okay
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('gallery-thumbnails', 'gallery-thumbnails', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('service-images', 'service-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery-images bucket
CREATE POLICY "Public can view gallery images storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update gallery images storage"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gallery-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete gallery images storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for gallery-thumbnails bucket
CREATE POLICY "Public can view thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-thumbnails');

CREATE POLICY "Admins can manage thumbnails"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'gallery-thumbnails'
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'gallery-thumbnails'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for service-images bucket
CREATE POLICY "Public can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

CREATE POLICY "Admins can manage service images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'service-images'
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'service-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Helper function to get gallery image URL from storage path
CREATE OR REPLACE FUNCTION public.get_gallery_image_url(storage_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN format(
    '%s/storage/v1/object/public/gallery-images/%s',
    current_setting('app.settings.supabase_url', true),
    storage_path
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get thumbnail URL from storage path
CREATE OR REPLACE FUNCTION public.get_thumbnail_url(storage_path TEXT)
RETURNS TEXT AS $$
BEGIN
  IF storage_path IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN format(
    '%s/storage/v1/object/public/gallery-thumbnails/%s',
    current_setting('app.settings.supabase_url', true),
    storage_path
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.gallery_images IS 'Gallery images with AI tagging and metadata';
COMMENT ON TABLE public.gallery_collections IS 'Collections for organizing gallery images';
COMMENT ON TABLE public.gallery_collection_images IS 'Many-to-many relationship between images and collections';
COMMENT ON COLUMN public.gallery_images.ai_confidence IS 'Confidence score from AI tagging (0.0 to 1.0)';
COMMENT ON COLUMN public.gallery_images.display_order IS 'Order for displaying images (lower numbers first)';
