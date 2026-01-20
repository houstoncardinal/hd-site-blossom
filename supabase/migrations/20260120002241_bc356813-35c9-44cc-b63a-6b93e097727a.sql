
-- =============================================
-- GALLERY SYSTEM TABLES
-- =============================================

-- Gallery Images Table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC,
  title TEXT,
  description TEXT,
  alt_text TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'special_events',
  tags TEXT[] DEFAULT '{}',
  ai_tags TEXT[] DEFAULT '{}',
  ai_description TEXT,
  ai_confidence NUMERIC,
  ai_processed_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Gallery Collections Table
CREATE TABLE public.gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  cover_image_id UUID REFERENCES public.gallery_images(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Junction Table for Collections and Images
CREATE TABLE public.gallery_collection_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.gallery_collections(id) ON DELETE CASCADE NOT NULL,
  image_id UUID REFERENCES public.gallery_images(id) ON DELETE CASCADE NOT NULL,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(collection_id, image_id)
);

-- Before/After Pairs Table
CREATE TABLE public.before_after_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  before_image_id UUID REFERENCES public.gallery_images(id) ON DELETE CASCADE NOT NULL,
  after_image_id UUID REFERENCES public.gallery_images(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  description TEXT,
  service_type TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- BUSINESS SETTINGS TABLE
-- =============================================

CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- USER SETTINGS TABLE
-- =============================================

CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  dashboard_layout JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - GALLERY IMAGES
-- =============================================

CREATE POLICY "Published images are publicly readable"
ON public.gallery_images FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all images"
ON public.gallery_images FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert images"
ON public.gallery_images FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images"
ON public.gallery_images FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images"
ON public.gallery_images FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - GALLERY COLLECTIONS
-- =============================================

CREATE POLICY "Published collections are publicly readable"
ON public.gallery_collections FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all collections"
ON public.gallery_collections FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage collections"
ON public.gallery_collections FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - COLLECTION IMAGES JUNCTION
-- =============================================

CREATE POLICY "Collection images publicly readable for published collections"
ON public.gallery_collection_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gallery_collections
    WHERE id = collection_id AND is_published = true
  )
);

CREATE POLICY "Admins can manage collection images"
ON public.gallery_collection_images FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - BEFORE/AFTER PAIRS
-- =============================================

CREATE POLICY "Published pairs are publicly readable"
ON public.before_after_pairs FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all pairs"
ON public.before_after_pairs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage pairs"
ON public.before_after_pairs FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - BUSINESS SETTINGS
-- =============================================

CREATE POLICY "Business settings are publicly readable"
ON public.business_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage business settings"
ON public.business_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - NOTIFICATIONS
-- =============================================

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
ON public.notifications FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - USER SETTINGS
-- =============================================

CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings"
ON public.user_settings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_collections_updated_at
BEFORE UPDATE ON public.gallery_collections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_before_after_pairs_updated_at
BEFORE UPDATE ON public.before_after_pairs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery-images', 'gallery-images', true),
  ('gallery-thumbnails', 'gallery-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES
-- =============================================

CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Gallery thumbnails are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-thumbnails');

CREATE POLICY "Admins can manage gallery thumbnails"
ON storage.objects FOR ALL
USING (
  bucket_id = 'gallery-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'gallery-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_is_published ON public.gallery_images(is_published);
CREATE INDEX idx_gallery_images_is_featured ON public.gallery_images(is_featured);
CREATE INDEX idx_gallery_images_display_order ON public.gallery_images(display_order);
CREATE INDEX idx_gallery_collections_slug ON public.gallery_collections(slug);
CREATE INDEX idx_gallery_collections_is_published ON public.gallery_collections(is_published);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_business_settings_key ON public.business_settings(setting_key);

-- =============================================
-- ENABLE REALTIME FOR NOTIFICATIONS
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
