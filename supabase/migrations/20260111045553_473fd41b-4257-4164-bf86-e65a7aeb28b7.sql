-- Create services table for admin-managed services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  deposit NUMERIC,
  duration TEXT,
  duration_minutes INTEGER DEFAULT 60,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'makeup',
  includes TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  event_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can view active services
CREATE POLICY "Active services are publicly readable"
ON public.services
FOR SELECT
USING (is_active = true);

-- Admins can view all services (including inactive)
CREATE POLICY "Admins can view all services"
ON public.services
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert services
CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update services
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete services
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create service_categories table for managing categories
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Public can view active categories
CREATE POLICY "Active categories are publicly readable"
ON public.service_categories
FOR SELECT
USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.service_categories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default categories
INSERT INTO public.service_categories (name, display_name, description, display_order) VALUES
  ('makeup', 'Makeup', 'Professional makeup services', 1),
  ('hair', 'Hair', 'Hair styling services', 2),
  ('combo', 'Hair + Makeup', 'Combined packages', 3),
  ('bridal', 'Bridal', 'Wedding and bridal services', 4),
  ('event', 'Events', 'Special event packages', 5),
  ('addon', 'Add-ons', 'Additional services', 6);