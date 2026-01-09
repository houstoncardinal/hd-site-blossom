-- Migration: Pricing System
-- Description: Creates tables for pricing tiers, add-ons, dynamic rules, and discount codes
-- Author: Enterprise Admin System
-- Date: 2026-01-08

-- Pricing tier types enum
CREATE TYPE pricing_tier_type AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Pricing rule types enum
CREATE TYPE pricing_rule_type AS ENUM (
  'day_of_week',
  'time_of_day',
  'seasonal',
  'event_based',
  'capacity_based',
  'advance_booking'
);

-- Discount types enum
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'buy_x_get_y');

-- Pricing tiers (Bronze/Silver/Gold for each service)
CREATE TABLE public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,

  -- Tier info
  tier_type pricing_tier_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  price_modifier_percentage INTEGER, -- e.g., +20% from base

  -- Features
  features TEXT[] DEFAULT '{}',

  -- Display
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE (service_id, tier_type)
);

-- Add-ons marketplace
CREATE TABLE public.add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'makeup', 'hair', 'general'

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  price_range TEXT, -- e.g., "$14-29" for variable pricing

  -- Compatibility
  compatible_service_ids UUID[] DEFAULT '{}', -- empty array = compatible with all

  -- Display
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dynamic pricing rules
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Rule info
  name TEXT NOT NULL,
  description TEXT,
  rule_type pricing_rule_type NOT NULL,

  -- Rule conditions (JSONB for flexibility)
  -- Examples:
  -- day_of_week: {"days": ["saturday", "sunday"], "multiplier": 1.2}
  -- time_of_day: {"start_time": "18:00", "end_time": "22:00", "multiplier": 1.15}
  -- seasonal: {"start_date": "2026-12-15", "end_date": "2027-01-05", "multiplier": 1.3}
  conditions JSONB NOT NULL,

  -- Price modification
  price_modifier_type TEXT NOT NULL CHECK (price_modifier_type IN ('percentage', 'fixed_amount')),
  price_modifier_value DECIMAL(10,2) NOT NULL,

  -- Applicability
  applies_to_service_ids UUID[], -- null = all services
  applies_to_categories service_category[],

  -- Priority (higher priority rules apply first)
  priority INTEGER DEFAULT 0,

  -- Active period
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Discount codes and promotions
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Code info
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  -- Discount details
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,

  -- For buy_x_get_y
  buy_quantity INTEGER,
  get_quantity INTEGER,

  -- Constraints
  minimum_purchase_amount DECIMAL(10,2),
  maximum_discount_amount DECIMAL(10,2),

  -- Usage limits
  usage_limit INTEGER, -- null = unlimited
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,

  -- Applicability
  applies_to_service_ids UUID[],
  applies_to_package_ids UUID[],

  -- Valid period
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Referral tracking
  is_referral_code BOOLEAN DEFAULT false,
  referred_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Track discount code usage
CREATE TABLE public.discount_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID REFERENCES public.discount_codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,

  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_pricing_tiers_service ON public.pricing_tiers(service_id);
CREATE INDEX idx_pricing_tiers_tier_type ON public.pricing_tiers(tier_type);
CREATE INDEX idx_add_ons_category ON public.add_ons(category);
CREATE INDEX idx_add_ons_active ON public.add_ons(is_active);
CREATE INDEX idx_pricing_rules_type ON public.pricing_rules(rule_type);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active);
CREATE INDEX idx_pricing_rules_priority ON public.pricing_rules(priority DESC);
CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_active ON public.discount_codes(is_active);
CREATE INDEX idx_discount_code_usage_code ON public.discount_code_usage(discount_code_id);
CREATE INDEX idx_discount_code_usage_user ON public.discount_code_usage(user_id);

-- Enable Row Level Security
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_code_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing tiers
CREATE POLICY "Active pricing tiers are publicly viewable"
  ON public.pricing_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage pricing tiers"
  ON public.pricing_tiers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for add-ons
CREATE POLICY "Active add-ons are publicly viewable"
  ON public.add_ons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage add-ons"
  ON public.add_ons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pricing rules
CREATE POLICY "Active pricing rules are publicly viewable"
  ON public.pricing_rules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage pricing rules"
  ON public.pricing_rules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for discount codes
CREATE POLICY "Active discount codes are viewable by code"
  ON public.discount_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage discount codes"
  ON public.discount_codes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for discount code usage
CREATE POLICY "Users can view their own discount usage"
  ON public.discount_code_usage FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert discount usage"
  ON public.discount_code_usage FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage discount usage"
  ON public.discount_code_usage FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON public.pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_add_ons_updated_at
  BEFORE UPDATE ON public.add_ons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to validate and apply discount codes
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  p_code TEXT,
  p_service_ids UUID[],
  p_package_ids UUID[],
  p_total_amount DECIMAL,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  discount_id UUID,
  discount_amount DECIMAL,
  message TEXT
) AS $$
DECLARE
  v_discount RECORD;
  v_user_usage_count INTEGER;
  v_calculated_discount DECIMAL;
BEGIN
  -- Find the discount code
  SELECT * INTO v_discount
  FROM public.discount_codes
  WHERE code = UPPER(p_code)
    AND is_active = true
    AND valid_from <= NOW()
    AND valid_until >= NOW();

  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Invalid or expired discount code';
    RETURN;
  END IF;

  -- Check global usage limits
  IF v_discount.usage_limit IS NOT NULL AND v_discount.usage_count >= v_discount.usage_limit THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code has reached usage limit';
    RETURN;
  END IF;

  -- Check per-user usage limits
  IF p_user_id IS NOT NULL AND v_discount.per_user_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_usage_count
    FROM public.discount_code_usage
    WHERE discount_code_id = v_discount.id
      AND user_id = p_user_id;

    IF v_user_usage_count >= v_discount.per_user_limit THEN
      RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'You have already used this discount code';
      RETURN;
    END IF;
  END IF;

  -- Check minimum purchase amount
  IF v_discount.minimum_purchase_amount IS NOT NULL AND p_total_amount < v_discount.minimum_purchase_amount THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, format('Minimum purchase amount of $%s not met', v_discount.minimum_purchase_amount);
    RETURN;
  END IF;

  -- Check applicability to services/packages
  IF v_discount.applies_to_service_ids IS NOT NULL
     AND NOT (v_discount.applies_to_service_ids && p_service_ids) THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code is not applicable to selected services';
    RETURN;
  END IF;

  IF v_discount.applies_to_package_ids IS NOT NULL
     AND NOT (v_discount.applies_to_package_ids && p_package_ids) THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code is not applicable to selected packages';
    RETURN;
  END IF;

  -- Calculate discount
  IF v_discount.discount_type = 'percentage' THEN
    v_calculated_discount := p_total_amount * (v_discount.discount_value / 100);
  ELSIF v_discount.discount_type = 'fixed_amount' THEN
    v_calculated_discount := v_discount.discount_value;
  ELSIF v_discount.discount_type = 'buy_x_get_y' THEN
    -- For buy_x_get_y, just apply the discount value
    v_calculated_discount := v_discount.discount_value;
  END IF;

  -- Apply maximum discount cap
  IF v_discount.maximum_discount_amount IS NOT NULL THEN
    v_calculated_discount := LEAST(v_calculated_discount, v_discount.maximum_discount_amount);
  END IF;

  -- Don't allow discount to exceed total
  v_calculated_discount := LEAST(v_calculated_discount, p_total_amount);

  RETURN QUERY SELECT true, v_discount.id, v_calculated_discount, 'Discount applied successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record discount usage (called after successful booking)
CREATE OR REPLACE FUNCTION public.record_discount_usage(
  p_code TEXT,
  p_discount_amount DECIMAL,
  p_user_id UUID DEFAULT NULL,
  p_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_discount_id UUID;
BEGIN
  -- Get discount code ID
  SELECT id INTO v_discount_id
  FROM public.discount_codes
  WHERE code = UPPER(p_code);

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Insert usage record
  INSERT INTO public.discount_code_usage (discount_code_id, user_id, appointment_id, discount_amount)
  VALUES (v_discount_id, p_user_id, p_appointment_id, p_discount_amount);

  -- Increment usage count
  UPDATE public.discount_codes
  SET usage_count = usage_count + 1
  WHERE id = v_discount_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to evaluate pricing rules for a given service and datetime
CREATE OR REPLACE FUNCTION public.evaluate_pricing_rules(
  p_service_id UUID,
  p_date DATE,
  p_time TIME,
  p_base_price DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  v_rule RECORD;
  v_final_price DECIMAL := p_base_price;
  v_day_of_week TEXT;
BEGIN
  v_day_of_week := LOWER(TO_CHAR(p_date, 'Day'));

  -- Get applicable rules ordered by priority
  FOR v_rule IN
    SELECT *
    FROM public.pricing_rules
    WHERE is_active = true
      AND (valid_from IS NULL OR valid_from <= p_date)
      AND (valid_until IS NULL OR valid_until >= p_date)
      AND (
        applies_to_service_ids IS NULL
        OR p_service_id = ANY(applies_to_service_ids)
      )
    ORDER BY priority DESC
  LOOP
    -- Evaluate based on rule type
    IF v_rule.rule_type = 'day_of_week' THEN
      IF v_day_of_week = ANY(ARRAY(SELECT jsonb_array_elements_text(v_rule.conditions->'days'))) THEN
        IF v_rule.price_modifier_type = 'percentage' THEN
          v_final_price := v_final_price * (1 + v_rule.price_modifier_value / 100);
        ELSE
          v_final_price := v_final_price + v_rule.price_modifier_value;
        END IF;
      END IF;
    END IF;

    -- Additional rule type evaluations can be added here
  END LOOP;

  RETURN v_final_price;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: Add-ons compatible with each service
CREATE OR REPLACE VIEW public.service_compatible_addons AS
SELECT
  s.id AS service_id,
  s.name AS service_name,
  a.id AS addon_id,
  a.name AS addon_name,
  a.price AS addon_price,
  a.category AS addon_category
FROM public.services s
CROSS JOIN public.add_ons a
WHERE a.is_active = true
  AND (
    a.compatible_service_ids = '{}'::UUID[]
    OR s.id = ANY(a.compatible_service_ids)
  );

-- Grant SELECT on views
GRANT SELECT ON public.service_compatible_addons TO authenticated;
GRANT SELECT ON public.service_compatible_addons TO anon;

-- Comments for documentation
COMMENT ON TABLE public.pricing_tiers IS 'Tiered pricing options (Bronze/Silver/Gold) for each service';
COMMENT ON TABLE public.add_ons IS 'Add-on services and products available for purchase';
COMMENT ON TABLE public.pricing_rules IS 'Dynamic pricing rules based on time, date, and other factors';
COMMENT ON TABLE public.discount_codes IS 'Promotional discount codes and referral codes';
COMMENT ON TABLE public.discount_code_usage IS 'Tracks usage of discount codes';
COMMENT ON FUNCTION public.validate_discount_code IS 'Validates a discount code and calculates the discount amount';
COMMENT ON FUNCTION public.record_discount_usage IS 'Records discount code usage and increments count';
COMMENT ON FUNCTION public.evaluate_pricing_rules IS 'Evaluates all applicable pricing rules and returns final price';
