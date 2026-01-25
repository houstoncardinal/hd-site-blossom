-- ============================================
-- HDA STUDIO - COMPLETE DATABASE SCHEMA
-- Fresh Supabase Migration
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. CUSTOM TYPES (ENUMS)
-- ============================================

-- App role for user permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Gallery image categories
CREATE TYPE public.gallery_category AS ENUM (
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

-- Service categories
CREATE TYPE public.service_category AS ENUM (
  'makeup',
  'hair',
  'combo',
  'bridal',
  'event',
  'bundle',
  'addon'
);

-- Pricing tier types
CREATE TYPE public.pricing_tier_type AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Pricing rule types
CREATE TYPE public.pricing_rule_type AS ENUM (
  'day_of_week',
  'time_of_day',
  'seasonal',
  'event_based',
  'capacity_based',
  'advance_booking'
);

-- Discount types
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed_amount', 'buy_x_get_y');

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 4. CORE TABLES
-- ============================================

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- User Settings (per-user preferences)
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  dashboard_layout JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'appointment', 'review', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Business Settings (key-value store)
CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  category TEXT,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team Members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  image_url TEXT,
  instagram_handle TEXT,
  years_experience INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 5. APPOINTMENTS & REVIEWS
-- ============================================

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_name TEXT NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2),
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_name TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 6. SERVICES & PRICING
-- ============================================

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  deposit NUMERIC,
  deposit_percentage INTEGER DEFAULT 50 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100),
  duration TEXT,
  duration_minutes INTEGER DEFAULT 60,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'makeup',
  includes TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  event_types TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service Packages (bundles)
CREATE TABLE public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category service_category NOT NULL DEFAULT 'bundle',
  package_price DECIMAL(10,2) NOT NULL,
  original_total_price DECIMAL(10,2),
  deposit_percentage INTEGER NOT NULL DEFAULT 50 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100),
  savings_amount DECIMAL(10,2),
  includes TEXT[] DEFAULT '{}',
  total_duration_minutes INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Package Services (junction table)
CREATE TABLE public.package_services (
  package_id UUID NOT NULL REFERENCES public.service_packages(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  PRIMARY KEY (package_id, service_id)
);

-- Pricing Tiers
CREATE TABLE public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  tier_type pricing_tier_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_modifier_percentage INTEGER,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_id, tier_type)
);

-- Add-ons
CREATE TABLE public.add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('makeup', 'hair', 'general')),
  price DECIMAL(10,2) NOT NULL,
  price_range TEXT,
  compatible_service_ids UUID[] DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing Rules (dynamic pricing)
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rule_type pricing_rule_type NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  price_modifier_type TEXT NOT NULL CHECK (price_modifier_type IN ('percentage', 'fixed_amount')),
  price_modifier_value DECIMAL(10,2) NOT NULL,
  applies_to_service_ids UUID[] DEFAULT '{}',
  applies_to_categories service_category[] DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discount Codes
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  buy_quantity INTEGER,
  get_quantity INTEGER,
  minimum_purchase_amount DECIMAL(10,2),
  maximum_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  per_user_limit INTEGER NOT NULL DEFAULT 1,
  applies_to_service_ids UUID[] DEFAULT '{}',
  applies_to_package_ids UUID[] DEFAULT '{}',
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_referral_code BOOLEAN NOT NULL DEFAULT false,
  referred_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discount Code Usage
CREATE TABLE public.discount_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID NOT NULL REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 7. GALLERY & CONTENT
-- ============================================

-- Gallery Images
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  thumbnail_path TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  aspect_ratio DECIMAL(5,2),
  title TEXT,
  description TEXT,
  alt_text TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'special_events',
  tags TEXT[] DEFAULT '{}',
  ai_tags TEXT[] DEFAULT '{}',
  ai_description TEXT,
  ai_confidence NUMERIC CHECK (ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 1)),
  ai_processed_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery Collections
CREATE TABLE public.gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  cover_image_id UUID REFERENCES public.gallery_images(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery Collection Images (junction table)
CREATE TABLE public.gallery_collection_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.gallery_collections(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(collection_id, image_id)
);

-- Before/After Pairs
CREATE TABLE public.before_after_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  before_image_id UUID NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
  after_image_id UUID NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  service_type TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 8. INDEXES
-- ============================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_email ON public.appointments(client_email);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_published ON public.gallery_images(is_published);
CREATE INDEX idx_gallery_images_featured ON public.gallery_images(is_featured);
CREATE INDEX idx_gallery_images_tags ON public.gallery_images USING GIN(tags);
CREATE INDEX idx_gallery_images_ai_tags ON public.gallery_images USING GIN(ai_tags);
CREATE INDEX idx_gallery_collections_slug ON public.gallery_collections(slug);
CREATE INDEX idx_business_settings_key ON public.business_settings(setting_key);
CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);

-- ============================================
-- 9. TRIGGERS
-- ============================================

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON public.business_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_packages_updated_at
  BEFORE UPDATE ON public.service_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON public.pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_add_ons_updated_at
  BEFORE UPDATE ON public.add_ons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_collections_updated_at
  BEFORE UPDATE ON public.gallery_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_before_after_pairs_updated_at
  BEFORE UPDATE ON public.before_after_pairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_pairs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- User Roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User Settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Business Settings
CREATE POLICY "Business settings are publicly readable" ON public.business_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage business settings" ON public.business_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Team Members
CREATE POLICY "Active team members are publicly readable" ON public.team_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Appointments
CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view appointments" ON public.appointments
  FOR SELECT USING (true);

CREATE POLICY "Admins can update appointments" ON public.appointments
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete appointments" ON public.appointments
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE POLICY "Anyone can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Approved reviews are publicly readable" ON public.reviews
  FOR SELECT USING (is_approved = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE POLICY "Active services are publicly viewable" ON public.services
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service Packages
CREATE POLICY "Active packages are publicly viewable" ON public.service_packages
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage packages" ON public.service_packages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Package Services
CREATE POLICY "Package services are publicly viewable" ON public.package_services
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage package services" ON public.package_services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Pricing Tiers
CREATE POLICY "Active pricing tiers are publicly viewable" ON public.pricing_tiers
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage pricing tiers" ON public.pricing_tiers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add-ons
CREATE POLICY "Active add-ons are publicly viewable" ON public.add_ons
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage add-ons" ON public.add_ons
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Pricing Rules
CREATE POLICY "Active pricing rules are publicly viewable" ON public.pricing_rules
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage pricing rules" ON public.pricing_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Discount Codes
CREATE POLICY "Active discount codes are viewable" ON public.discount_codes
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage discount codes" ON public.discount_codes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Discount Code Usage
CREATE POLICY "Admins can view discount usage" ON public.discount_code_usage
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can record discount usage" ON public.discount_code_usage
  FOR INSERT WITH CHECK (true);

-- Gallery Images
CREATE POLICY "Published images are publicly viewable" ON public.gallery_images
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Gallery Collections
CREATE POLICY "Published collections are publicly viewable" ON public.gallery_collections
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage collections" ON public.gallery_collections
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Gallery Collection Images
CREATE POLICY "Collection images are publicly viewable" ON public.gallery_collection_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage collection images" ON public.gallery_collection_images
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Before/After Pairs
CREATE POLICY "Published pairs are publicly viewable" ON public.before_after_pairs
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage before/after pairs" ON public.before_after_pairs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 11. STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('gallery-thumbnails', 'gallery-thumbnails', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('service-images', 'service-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery-images
CREATE POLICY "Public can view gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for gallery-thumbnails
CREATE POLICY "Public can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-thumbnails');

CREATE POLICY "Admins can manage thumbnails" ON storage.objects
  FOR ALL USING (bucket_id = 'gallery-thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for service-images
CREATE POLICY "Public can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admins can manage service images" ON storage.objects
  FOR ALL USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 12. REALTIME
-- ============================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- ============================================
-- 13. SEED DATA
-- ============================================

-- Insert default business settings
INSERT INTO public.business_settings (setting_key, setting_value, category, description)
VALUES
  ('business_info', '{"name": "HDA Studio", "tagline": "Luxury Beauty Services", "phone": "+18329070199", "email": "hello@hdastudio.com"}', 'general', 'Basic business information'),
  ('business_hours', '[{"day": "Monday", "open": "09:00", "close": "18:00", "isOpen": true}, {"day": "Tuesday", "open": "09:00", "close": "18:00", "isOpen": true}, {"day": "Wednesday", "open": "09:00", "close": "18:00", "isOpen": true}, {"day": "Thursday", "open": "09:00", "close": "18:00", "isOpen": true}, {"day": "Friday", "open": "09:00", "close": "18:00", "isOpen": true}, {"day": "Saturday", "open": "10:00", "close": "16:00", "isOpen": true}, {"day": "Sunday", "open": "10:00", "close": "16:00", "isOpen": false}]', 'hours', 'Business operating hours'),
  ('booking_settings', '{"requireDeposit": true, "depositPercentage": 50, "minAdvanceHours": 24, "maxAdvanceDays": 90, "allowSameDay": false}', 'booking', 'Booking configuration')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default services (matching the simplified 4 glam services)
INSERT INTO public.services (id, name, slug, description, price, original_price, deposit, duration, duration_minutes, category, includes, is_active, is_popular, display_order, stripe_price_id)
VALUES
  (gen_random_uuid(), 'Basic Soft Glam', 'basic-soft-glam', 'Natural, polished look with soft definition. Perfect for everyday elegance.', 120, 150, 60, '45 min', 45, 'makeup', ARRAY['Professional skin preparation', 'Full coverage base application', 'Soft blush & bronzer', 'Expert brow grooming', 'Subtle eye enhancement', 'Complimentary lash application', 'Lip color coordination', 'Long-lasting setting spray'], true, false, 1, 'price_1SnNAfEmDDtU2eufx8NGpPKj'),
  (gen_random_uuid(), 'Soft Glam', 'soft-glam', 'Enhanced everyday glam with refined sophistication for any occasion.', 150, 180, 75, '60 min', 60, 'makeup', ARRAY['Full coverage base with skin perfection', 'Soft contour & bronzer application', 'Blush placement for dimension', 'Defined eyeshadow with blending', 'Brow enhancement & definition', 'Complimentary lash application', 'Perfectly matched lip color', 'Professional finishing & setting'], true, false, 2, 'price_1SnNArEmDDtU2eufipMNyOov'),
  (gen_random_uuid(), 'Full Glam', 'full-glam', 'Balanced, event-ready glam perfect for weddings, parties, and special occasions.', 180, 210, 90, '75 min', 75, 'makeup', ARRAY['Flawless full coverage base', 'Professional contour & blush sculpting', 'Strategic highlighter placement', 'Defined eye look with dimension', 'Premium complimentary lash application', 'Expert lip color coordination', 'Camera-ready finishing touches', 'Long-wear formula setting'], true, true, 3, 'price_1SnNFGEmDDtU2eufmIHr1CUH'),
  (gen_random_uuid(), 'Signature Glam', 'signature-glam', 'Premium show-stopping glamour with intricate artistry for red carpet events.', 216, 246, 108, '90 min', 90, 'makeup', ARRAY['High-coverage flawless base', 'Full facial contouring & sculpting', 'Enhanced eye makeup artistry', 'Glitter or cut crease design available', 'Precision highlighter balance', 'Premium complimentary lash application', 'Statement lip color application', 'Professional photo-ready finishing', 'Touch-up kit included'], true, false, 4, 'price_1SnNGcEmDDtU2eufzbO51FUU')
ON CONFLICT DO NOTHING;

-- Insert team members (Founder first, then team)
INSERT INTO public.team_members (name, role, bio, specialties, image_url, instagram_handle, years_experience, is_active, display_order)
VALUES
  (
    'Huda Javed',
    'Founder & Lead Makeup Artist',
    'Huda is the creative force behind HDA Studio, bringing over 8 years of professional makeup artistry experience. Her passion for enhancing natural beauty and creating stunning transformations has made her one of Houston''s most sought-after makeup artists. Specializing in bridal, editorial, and special event makeup, Huda combines technical expertise with artistic vision to deliver flawless results every time.',
    ARRAY['Bridal Makeup', 'Editorial', 'Special Events', 'Soft Glam', 'Full Glam'],
    '/IMG_8915.JPG',
    '@hdastudio',
    8,
    true,
    1
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
