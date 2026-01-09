// Pricing System Type Definitions
// Auto-generated from database schema - sync with Supabase

import type { ServiceCategory } from './services';

export type PricingTierType = 'bronze' | 'silver' | 'gold' | 'platinum';

export type PricingRuleType =
  | 'day_of_week'
  | 'time_of_day'
  | 'seasonal'
  | 'event_based'
  | 'capacity_based'
  | 'advance_booking';

export type DiscountType = 'percentage' | 'fixed_amount' | 'buy_x_get_y';

export type PriceModifierType = 'percentage' | 'fixed_amount';

// Pricing Tiers
export interface PricingTier {
  id: string;
  service_id: string;

  // Tier info
  tier_type: PricingTierType;
  name: string;
  description: string | null;

  // Pricing
  price: number;
  price_modifier_percentage: number | null;

  // Features
  features: string[];

  // Display
  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

export interface PricingTierInsert {
  service_id: string;
  tier_type: PricingTierType;
  name: string;
  price: number;
  description?: string;
  price_modifier_percentage?: number;
  features?: string[];
  is_active?: boolean;
  display_order?: number;
}

export interface PricingTierUpdate {
  name?: string;
  description?: string;
  price?: number;
  price_modifier_percentage?: number;
  features?: string[];
  is_active?: boolean;
  display_order?: number;
}

// Add-ons
export interface AddOn {
  id: string;

  // Basic info
  name: string;
  slug: string;
  description: string;
  category: string;

  // Pricing
  price: number;
  price_range: string | null;

  // Compatibility
  compatible_service_ids: string[];

  // Display
  image_url: string | null;
  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

export interface AddOnInsert {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  price_range?: string;
  compatible_service_ids?: string[];
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface AddOnUpdate {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  price?: number;
  price_range?: string;
  compatible_service_ids?: string[];
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

// Pricing Rules
export interface PricingRule {
  id: string;

  // Rule info
  name: string;
  description: string | null;
  rule_type: PricingRuleType;

  // Rule conditions (JSONB)
  conditions: Record<string, any>;

  // Price modification
  price_modifier_type: PriceModifierType;
  price_modifier_value: number;

  // Applicability
  applies_to_service_ids: string[] | null;
  applies_to_categories: ServiceCategory[] | null;

  // Priority
  priority: number;

  // Active period
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface PricingRuleInsert {
  name: string;
  rule_type: PricingRuleType;
  conditions: Record<string, any>;
  price_modifier_type: PriceModifierType;
  price_modifier_value: number;
  description?: string;
  applies_to_service_ids?: string[];
  applies_to_categories?: ServiceCategory[];
  priority?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

export interface PricingRuleUpdate {
  name?: string;
  description?: string;
  rule_type?: PricingRuleType;
  conditions?: Record<string, any>;
  price_modifier_type?: PriceModifierType;
  price_modifier_value?: number;
  applies_to_service_ids?: string[];
  applies_to_categories?: ServiceCategory[];
  priority?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

// Discount Codes
export interface DiscountCode {
  id: string;

  // Code info
  code: string;
  name: string;
  description: string | null;

  // Discount details
  discount_type: DiscountType;
  discount_value: number;

  // For buy_x_get_y
  buy_quantity: number | null;
  get_quantity: number | null;

  // Constraints
  minimum_purchase_amount: number | null;
  maximum_discount_amount: number | null;

  // Usage limits
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number;

  // Applicability
  applies_to_service_ids: string[] | null;
  applies_to_package_ids: string[] | null;

  // Valid period
  valid_from: string;
  valid_until: string;
  is_active: boolean;

  // Referral tracking
  is_referral_code: boolean;
  referred_by_user_id: string | null;

  created_at: string;
  updated_at: string;
}

export interface DiscountCodeInsert {
  code: string;
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  valid_from: string;
  valid_until: string;
  description?: string;
  buy_quantity?: number;
  get_quantity?: number;
  minimum_purchase_amount?: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  per_user_limit?: number;
  applies_to_service_ids?: string[];
  applies_to_package_ids?: string[];
  is_active?: boolean;
  is_referral_code?: boolean;
  referred_by_user_id?: string;
}

export interface DiscountCodeUpdate {
  code?: string;
  name?: string;
  description?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  buy_quantity?: number;
  get_quantity?: number;
  minimum_purchase_amount?: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  per_user_limit?: number;
  applies_to_service_ids?: string[];
  applies_to_package_ids?: string[];
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
  is_referral_code?: boolean;
  referred_by_user_id?: string;
}

// Discount Code Usage
export interface DiscountCodeUsage {
  id: string;
  discount_code_id: string;
  user_id: string | null;
  appointment_id: string | null;
  discount_amount: number;
  used_at: string;
}

export interface DiscountCodeUsageInsert {
  discount_code_id: string;
  discount_amount: number;
  user_id?: string;
  appointment_id?: string;
}

// Validation Response
export interface DiscountValidationResult {
  is_valid: boolean;
  discount_id: string | null;
  discount_amount: number;
  message: string;
}

// Price Calculation Types
export interface PriceCalculationInput {
  serviceId?: string;
  packageId?: string;
  basePrice: number;
  selectedTier?: PricingTierType;
  addOnIds?: string[];
  date: Date | string;
  time: string;
  discountCode?: string;
  userId?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  tierPrice?: number;
  tierName?: string;
  addOnsTotal: number;
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  rulesApplied: Array<{
    ruleName: string;
    adjustment: number;
    adjustmentType: PriceModifierType;
  }>;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  finalPrice: number;
  depositAmount?: number;
}

// Rule Condition Types
export interface DayOfWeekConditions {
  days: string[];
  multiplier?: number;
}

export interface TimeOfDayConditions {
  start_time: string;
  end_time: string;
  multiplier?: number;
}

export interface SeasonalConditions {
  start_date: string;
  end_date: string;
  multiplier?: number;
}

export type RuleConditions =
  | DayOfWeekConditions
  | TimeOfDayConditions
  | SeasonalConditions
  | Record<string, any>;

// Display Labels
export const PRICING_TIER_LABELS: Record<PricingTierType, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export const PRICING_RULE_TYPE_LABELS: Record<PricingRuleType, string> = {
  day_of_week: 'Day of Week',
  time_of_day: 'Time of Day',
  seasonal: 'Seasonal',
  event_based: 'Event Based',
  capacity_based: 'Capacity Based',
  advance_booking: 'Advance Booking',
};

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage Off',
  fixed_amount: 'Fixed Amount',
  buy_x_get_y: 'Buy X Get Y',
};

// Helper Functions
export function calculateDiscount(
  total: number,
  discountType: DiscountType,
  discountValue: number,
  maxDiscount?: number
): number {
  let discount = 0;

  if (discountType === 'percentage') {
    discount = (total * discountValue) / 100;
  } else if (discountType === 'fixed_amount') {
    discount = discountValue;
  }

  if (maxDiscount) {
    discount = Math.min(discount, maxDiscount);
  }

  return Math.min(discount, total);
}

export function applyPricingRule(
  basePrice: number,
  modifierType: PriceModifierType,
  modifierValue: number
): number {
  if (modifierType === 'percentage') {
    return basePrice * (1 + modifierValue / 100);
  } else {
    return basePrice + modifierValue;
  }
}

export function formatDiscount(
  discountType: DiscountType,
  discountValue: number
): string {
  if (discountType === 'percentage') {
    return `${discountValue}% off`;
  } else if (discountType === 'fixed_amount') {
    return `$${discountValue} off`;
  } else {
    return 'Special offer';
  }
}

export function isDiscountCodeValid(discount: DiscountCode): boolean {
  const now = new Date();
  const validFrom = new Date(discount.valid_from);
  const validUntil = new Date(discount.valid_until);

  if (!discount.is_active) return false;
  if (now < validFrom || now > validUntil) return false;
  if (
    discount.usage_limit !== null &&
    discount.usage_count >= discount.usage_limit
  )
    return false;

  return true;
}

export function generateDiscountCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
