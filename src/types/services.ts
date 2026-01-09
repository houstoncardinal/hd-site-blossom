// Services & Packages Type Definitions
// Auto-generated from database schema - sync with Supabase

export type ServiceCategory =
  | 'makeup'
  | 'hair'
  | 'combo'
  | 'bridal'
  | 'event'
  | 'bundle';

export interface Service {
  id: string;

  // Basic info
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  category: ServiceCategory;

  // Pricing
  base_price: number;
  original_price: number | null;
  deposit_percentage: number;

  // Service details
  duration_minutes: number;
  includes: string[];

  // Display
  image_url: string | null;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;

  // Stripe integration
  stripe_price_id: string | null;

  // Event types
  event_types: string[];

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ServiceInsert {
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  base_price: number;
  duration_minutes: number;
  short_description?: string;
  original_price?: number;
  deposit_percentage?: number;
  includes?: string[];
  image_url?: string;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
  event_types?: string[];
}

export interface ServiceUpdate {
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category?: ServiceCategory;
  base_price?: number;
  original_price?: number;
  deposit_percentage?: number;
  duration_minutes?: number;
  includes?: string[];
  image_url?: string;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
  event_types?: string[];
}

export interface ServicePackage {
  id: string;

  // Basic info
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;

  // Pricing
  package_price: number;
  original_total_price: number | null;
  deposit_percentage: number;
  savings_amount: number | null;

  // Package details
  includes: string[];
  total_duration_minutes: number | null;

  // Display
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;

  // Stripe integration
  stripe_price_id: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ServicePackageInsert {
  name: string;
  slug: string;
  description: string;
  package_price: number;
  category?: ServiceCategory;
  original_total_price?: number;
  deposit_percentage?: number;
  savings_amount?: number;
  includes?: string[];
  total_duration_minutes?: number;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
  stripe_price_id?: string;
}

export interface ServicePackageUpdate {
  name?: string;
  slug?: string;
  description?: string;
  category?: ServiceCategory;
  package_price?: number;
  original_total_price?: number;
  deposit_percentage?: number;
  savings_amount?: number;
  includes?: string[];
  total_duration_minutes?: number;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
  stripe_price_id?: string;
}

export interface PackageService {
  package_id: string;
  service_id: string;
  quantity: number;
}

export interface PackageServiceInsert {
  package_id: string;
  service_id: string;
  quantity?: number;
}

// Extended types with calculations
export interface ServiceWithDeposit extends Service {
  deposit_amount: number;
}

export interface PackageWithDetails extends ServicePackage {
  deposit_amount: number;
  calculated_savings: number;
  calculated_duration: number;
  service_count: number;
  services?: Service[];
}

// Service Builder Types
export interface ServiceFormData {
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category: ServiceCategory;
  base_price: number;
  original_price?: number;
  deposit_percentage: number;
  duration_minutes: number;
  includes: string[];
  image_url?: string;
  is_active: boolean;
  is_popular: boolean;
  stripe_price_id?: string;
  event_types: string[];
}

export interface PackageFormData {
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  package_price: number;
  includes: string[];
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  selectedServices: Array<{
    serviceId: string;
    quantity: number;
  }>;
}

// Display Labels
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  makeup: 'Makeup',
  hair: 'Hair Styling',
  combo: 'Makeup & Hair',
  bridal: 'Bridal',
  event: 'Special Events',
  bundle: 'Package Bundle',
};

// Helper Functions
export function calculateDepositAmount(
  price: number,
  depositPercentage: number
): number {
  return Math.round((price * depositPercentage) / 100 * 100) / 100;
}

export function calculatePackageSavings(
  services: Service[],
  packageServices: PackageService[],
  packagePrice: number
): number {
  const totalServiceCost = packageServices.reduce((total, ps) => {
    const service = services.find(s => s.id === ps.service_id);
    return total + (service?.base_price || 0) * ps.quantity;
  }, 0);

  return Math.max(0, totalServiceCost - packagePrice);
}

export function calculatePackageDuration(
  services: Service[],
  packageServices: PackageService[]
): number {
  return packageServices.reduce((total, ps) => {
    const service = services.find(s => s.id === ps.service_id);
    return total + (service?.duration_minutes || 0) * ps.quantity;
  }, 0);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
