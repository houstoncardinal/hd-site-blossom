/**
 * SIMPLIFIED SERVICES CONFIGURATION
 *
 * 4 bookable glam services + 1 group inquiry option
 * Clean, minimal structure for streamlined booking flow.
 */

export type ServiceCategory = 'makeup' | 'group';

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  deposit: number;
  remainingBalance: number;
  duration: string;
  stripePriceId: string;
  category: ServiceCategory;
  includes?: string[];
  popular?: boolean;
}

// ============================================
// CORE GLAM SERVICES (4 bookable options)
// ============================================
export const GLAM_SERVICES: ServiceConfig[] = [
  {
    id: 'basic-soft-glam',
    name: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition. Perfect for everyday elegance.',
    price: 120,
    originalPrice: 150,
    deposit: 60,
    remainingBalance: 60,
    duration: '45 min',
    stripePriceId: 'price_1SnNAfEmDDtU2eufx8NGpPKj',
    category: 'makeup',
    includes: [
      'Professional skin preparation',
      'Full coverage base application',
      'Soft blush & bronzer',
      'Expert brow grooming',
      'Subtle eye enhancement',
      'Complimentary lash application',
      'Lip color coordination',
      'Long-lasting setting spray',
    ],
  },
  {
    id: 'soft-glam',
    name: 'Soft Glam',
    description: 'Enhanced everyday glam with refined sophistication for any occasion.',
    price: 150,
    originalPrice: 180,
    deposit: 75,
    remainingBalance: 75,
    duration: '60 min',
    stripePriceId: 'price_1SnNArEmDDtU2eufipMNyOov',
    category: 'makeup',
    includes: [
      'Full coverage base with skin perfection',
      'Soft contour & bronzer application',
      'Blush placement for dimension',
      'Defined eyeshadow with blending',
      'Brow enhancement & definition',
      'Complimentary lash application',
      'Perfectly matched lip color',
      'Professional finishing & setting',
    ],
  },
  {
    id: 'full-glam',
    name: 'Full Glam',
    description: 'Balanced, event-ready glam perfect for weddings, parties, and special occasions.',
    price: 180,
    originalPrice: 210,
    deposit: 90,
    remainingBalance: 90,
    duration: '75 min',
    stripePriceId: 'price_1SnNFGEmDDtU2eufmIHr1CUH',
    category: 'makeup',
    popular: true,
    includes: [
      'Flawless full coverage base',
      'Professional contour & blush sculpting',
      'Strategic highlighter placement',
      'Defined eye look with dimension',
      'Premium complimentary lash application',
      'Expert lip color coordination',
      'Camera-ready finishing touches',
      'Long-wear formula setting',
    ],
  },
  {
    id: 'signature-glam',
    name: 'Signature Glam',
    description: 'Premium show-stopping glamour with intricate artistry for red carpet events.',
    price: 216,
    originalPrice: 246,
    deposit: 108,
    remainingBalance: 108,
    duration: '90 min',
    stripePriceId: 'price_1SnNGcEmDDtU2eufzbO51FUU',
    category: 'makeup',
    includes: [
      'High-coverage flawless base',
      'Full facial contouring & sculpting',
      'Enhanced eye makeup artistry',
      'Glitter or cut crease design available',
      'Precision highlighter balance',
      'Premium complimentary lash application',
      'Statement lip color application',
      'Professional photo-ready finishing',
      'Touch-up kit included',
    ],
  },
];

// ============================================
// GROUP GLAM INQUIRY (Contact-based, not bookable)
// ============================================
export const GROUP_GLAM_INFO = {
  id: 'group-glam',
  name: 'Group Glam',
  subtitle: 'Bridal & Large Parties',
  description: 'Planning a bridal party or a group of 3+? We offer special discounted rates for families of the bride and large groups. Please contact us directly for a custom quote.',
  category: 'group' as ServiceCategory,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all bookable services
export const getBookableServices = (): ServiceConfig[] => GLAM_SERVICES;

// Get service by ID
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return GLAM_SERVICES.find(service => service.id === id);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Legacy compatibility - returns only glam services now
export const getAllServices = (): ServiceConfig[] => GLAM_SERVICES;
export const MAKEUP_SERVICES = GLAM_SERVICES;
export const SERVICES = GLAM_SERVICES;

// ============================================
// ADD-ONS (Optional enhancements)
// ============================================
export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export const ADDONS: AddOnService[] = [
  {
    id: 'lash-upgrade',
    name: 'Premium Lash Upgrade',
    description: 'Upgrade to premium mink or dramatic volume lashes',
    price: 15,
    category: 'addon',
  },
  {
    id: 'touch-up-kit',
    name: 'Touch-Up Kit',
    description: 'Take-home kit with lipstick, blotting papers & setting spray',
    price: 25,
    category: 'addon',
  },
  {
    id: 'travel-fee',
    name: 'Travel Fee (15+ miles)',
    description: 'Mobile service for locations beyond 15 miles from Houston',
    price: 35,
    category: 'addon',
  },
  {
    id: 'rush-service',
    name: 'Rush Service',
    description: 'Priority booking for appointments within 48 hours',
    price: 30,
    category: 'addon',
  },
];

// Empty arrays for backwards compatibility (removed features)
export const HAIR_SERVICES: ServiceConfig[] = [];
export const COMBO_PACKAGES: ServiceConfig[] = [];
export const EVENT_PACKAGES: ServiceConfig[] = [];
export const BUNDLES: ServiceConfig[] = [];
