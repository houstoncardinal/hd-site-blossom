-- Migration: Services & Packages System
-- Description: Creates tables for services and service packages (bundles)
-- Author: Enterprise Admin System
-- Date: 2026-01-08

-- Service categories enum
CREATE TYPE service_category AS ENUM (
  'makeup',
  'hair',
  'combo',
  'bridal',
  'event',
  'bundle'
);

-- Services table (replacing the hardcoded config)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category service_category NOT NULL,

  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  deposit_percentage INTEGER DEFAULT 50 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100),

  -- Service details
  duration_minutes INTEGER NOT NULL,
  includes TEXT[] DEFAULT '{}',

  -- Display
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Stripe integration
  stripe_price_id TEXT,

  -- Event types (for filtering)
  event_types TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Service packages (bundles of services at special pricing)
CREATE TABLE public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category service_category DEFAULT 'bundle',

  -- Pricing
  package_price DECIMAL(10,2) NOT NULL,
  original_total_price DECIMAL(10,2),
  deposit_percentage INTEGER DEFAULT 50 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100),
  savings_amount DECIMAL(10,2),

  -- Package details
  includes TEXT[] DEFAULT '{}',
  total_duration_minutes INTEGER,

  -- Display
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Stripe integration
  stripe_price_id TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Many-to-many: packages contain multiple services
CREATE TABLE public.package_services (
  package_id UUID REFERENCES public.service_packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  PRIMARY KEY (package_id, service_id)
);

-- Create indexes for performance
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_services_popular ON public.services(is_popular);
CREATE INDEX idx_services_display_order ON public.services(display_order);
CREATE INDEX idx_service_packages_active ON public.service_packages(is_active);
CREATE INDEX idx_service_packages_featured ON public.service_packages(is_featured);
CREATE INDEX idx_service_packages_display_order ON public.service_packages(display_order);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Active services are publicly viewable"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for service packages
CREATE POLICY "Active packages are publicly viewable"
  ON public.service_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON public.service_packages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for package services
CREATE POLICY "Package services are publicly viewable"
  ON public.package_services FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage package services"
  ON public.package_services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_packages_updated_at
  BEFORE UPDATE ON public.service_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate package savings
CREATE OR REPLACE FUNCTION public.calculate_package_savings(package_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_services_price DECIMAL;
  package_price DECIMAL;
BEGIN
  -- Sum up the price of all services in the package
  SELECT SUM(s.base_price * ps.quantity)
  INTO total_services_price
  FROM public.package_services ps
  JOIN public.services s ON ps.service_id = s.id
  WHERE ps.package_id = calculate_package_savings.package_id;

  -- Get the package price
  SELECT sp.package_price
  INTO package_price
  FROM public.service_packages sp
  WHERE sp.id = calculate_package_savings.package_id;

  -- Return the savings (original total - package price)
  RETURN COALESCE(total_services_price - package_price, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total duration of package
CREATE OR REPLACE FUNCTION public.calculate_package_duration(package_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_duration INTEGER;
BEGIN
  SELECT SUM(s.duration_minutes * ps.quantity)
  INTO total_duration
  FROM public.package_services ps
  JOIN public.services s ON ps.service_id = s.id
  WHERE ps.package_id = calculate_package_duration.package_id;

  RETURN COALESCE(total_duration, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update package savings and duration
CREATE OR REPLACE FUNCTION public.update_package_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.service_packages
  SET
    savings_amount = public.calculate_package_savings(NEW.package_id),
    total_duration_minutes = public.calculate_package_duration(NEW.package_id)
  WHERE id = NEW.package_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_metadata_on_service_change
  AFTER INSERT OR UPDATE OR DELETE ON public.package_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_package_metadata();

-- View: Services with calculated deposit amounts
CREATE OR REPLACE VIEW public.services_with_deposits AS
SELECT
  s.*,
  (s.base_price * s.deposit_percentage / 100)::DECIMAL(10,2) AS deposit_amount
FROM public.services s;

-- View: Packages with calculated deposit amounts and service details
CREATE OR REPLACE VIEW public.packages_with_details AS
SELECT
  sp.*,
  (sp.package_price * sp.deposit_percentage / 100)::DECIMAL(10,2) AS deposit_amount,
  COALESCE(sp.savings_amount, public.calculate_package_savings(sp.id)) AS calculated_savings,
  COALESCE(sp.total_duration_minutes, public.calculate_package_duration(sp.id)) AS calculated_duration,
  COUNT(ps.service_id) AS service_count
FROM public.service_packages sp
LEFT JOIN public.package_services ps ON sp.id = ps.package_id
GROUP BY sp.id;

-- Grant SELECT on views to authenticated users
GRANT SELECT ON public.services_with_deposits TO authenticated;
GRANT SELECT ON public.packages_with_details TO authenticated;
GRANT SELECT ON public.services_with_deposits TO anon;
GRANT SELECT ON public.packages_with_details TO anon;

-- Comments for documentation
COMMENT ON TABLE public.services IS 'All available services with pricing and details';
COMMENT ON TABLE public.service_packages IS 'Service bundles/packages at special pricing';
COMMENT ON TABLE public.package_services IS 'Many-to-many relationship between packages and services';
COMMENT ON COLUMN public.services.deposit_percentage IS 'Percentage of base price required as deposit (0-100)';
COMMENT ON COLUMN public.service_packages.savings_amount IS 'Amount saved by purchasing package vs individual services';
COMMENT ON FUNCTION public.calculate_package_savings IS 'Calculates total savings for a package';
COMMENT ON FUNCTION public.calculate_package_duration IS 'Calculates total duration of all services in package';
