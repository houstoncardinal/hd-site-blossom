// Services Type Definitions
// Aligned with database schema

export type ServiceCategory =
  | 'makeup'
  | 'hair'
  | 'combo'
  | 'bridal'
  | 'event'
  | 'addon';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  deposit: number | null;
  duration: string | null;
  duration_minutes: number | null;
  image_url: string | null;
  category: string;
  includes: string[] | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  display_order: number | null;
  stripe_price_id: string | null;
  event_types: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceInsert {
  name: string;
  description?: string | null;
  price?: number;
  original_price?: number | null;
  deposit?: number | null;
  duration?: string | null;
  duration_minutes?: number | null;
  image_url?: string | null;
  category?: string;
  includes?: string[] | null;
  is_active?: boolean | null;
  is_popular?: boolean | null;
  display_order?: number | null;
  stripe_price_id?: string | null;
  event_types?: string[] | null;
}

export interface ServiceUpdate {
  name?: string;
  description?: string | null;
  price?: number;
  original_price?: number | null;
  deposit?: number | null;
  duration?: string | null;
  duration_minutes?: number | null;
  image_url?: string | null;
  category?: string;
  includes?: string[] | null;
  is_active?: boolean | null;
  is_popular?: boolean | null;
  display_order?: number | null;
  stripe_price_id?: string | null;
  event_types?: string[] | null;
}

// Display Labels
export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  makeup: 'Makeup',
  hair: 'Hair Styling',
  combo: 'Makeup & Hair',
  bridal: 'Bridal',
  event: 'Special Events',
  addon: 'Add-ons',
};

// Helper Functions
export function formatDuration(minutes: number | null): string {
  if (!minutes) return 'N/A';
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

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
