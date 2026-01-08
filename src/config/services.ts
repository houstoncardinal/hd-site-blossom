/**
 * SERVICES CONFIGURATION WITH STRIPE INTEGRATION
 * 
 * This file contains all service definitions with pricing and Stripe price IDs.
 * The deposit system collects 50% upfront, with the remaining balance due in person.
 */

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  deposit: number;
  remainingBalance: number;
  duration: string;
  image: string;
  stripePriceId: string;
  category: 'service' | 'bundle';
  includes?: string[];
}

export const SERVICES: ServiceConfig[] = [
  {
    id: 'basic-soft-glam',
    name: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition. Perfect for work, casual outings, or everyday elegance.',
    price: 100,
    originalPrice: 125,
    deposit: 50,
    remainingBalance: 50,
    duration: '45 min',
    image: '/IMG_8863.JPG',
    stripePriceId: 'price_1SnNAfEmDDtU2eufx8NGpPKj',
    category: 'service',
    includes: [
      'Professional skin preparation',
      'Full coverage base application',
      'Soft blush for natural flush',
      'Expert brow grooming & shaping',
      'Subtle eye makeup enhancement',
      'Complimentary lash application',
      'Coordinating lip color',
      'Long-lasting setting spray',
    ],
  },
  {
    id: 'soft-glam',
    name: 'Soft Glam',
    description: 'Enhanced everyday glam with gentle definition and refined sophistication for any occasion.',
    price: 125,
    originalPrice: 150,
    deposit: 62.50,
    remainingBalance: 62.50,
    duration: '60 min',
    image: '/IMG_8865.JPG',
    stripePriceId: 'price_1SnNArEmDDtU2eufipMNyOov',
    category: 'service',
    includes: [
      'Full coverage base with skin perfection',
      'Soft contour or bronzer application',
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
    price: 150,
    originalPrice: 175,
    deposit: 75,
    remainingBalance: 75,
    duration: '75 min',
    image: '/IMG_8916.JPG',
    stripePriceId: 'price_1SnNFGEmDDtU2eufmIHr1CUH',
    category: 'service',
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
    description: 'Premium show-stopping glamour with intricate artistry for red carpet events and editorials.',
    price: 180,
    originalPrice: 205,
    deposit: 90,
    remainingBalance: 90,
    duration: '90 min',
    image: '/IMG_8912.JPG',
    stripePriceId: 'price_1SnNGcEmDDtU2eufzbO51FUU',
    category: 'service',
    includes: [
      'High-coverage flawless base',
      'Full facial contouring & sculpting',
      'Enhanced eye makeup artistry',
      'Glitter or cut crease eye design',
      'Precision highlighter balance',
      'Premium complimentary lash application',
      'Statement lip color application',
      'Professional photo-ready finishing',
      'Touch-up kit included',
    ],
  },
];

export const BUNDLES: ServiceConfig[] = [
  {
    id: 'bridal-bride',
    name: 'Bridal Party (Bride)',
    description: 'Premium bridal makeup for your special day. Pre-wedding trial NOT included.',
    price: 200,
    originalPrice: 250,
    deposit: 100,
    remainingBalance: 100,
    duration: '120 min',
    image: '/IMG_8900.JPG',
    stripePriceId: 'price_1SnNHhEmDDtU2eufxHcrH6BU',
    category: 'bundle',
    includes: [
      'Bride receives premium bridal makeup',
      'Group scheduling priority',
      'On-location service available',
    ],
  },
  {
    id: 'bridal-bridesmaid',
    name: 'Bridal Party (Bridesmaid/Family)',
    description: 'Flat rate makeup for bridesmaids and family members.',
    price: 100,
    originalPrice: 125,
    deposit: 50,
    remainingBalance: 50,
    duration: '60 min',
    image: '/IMG_8901.JPG',
    stripePriceId: 'price_1SnNI1EmDDtU2eufW5983nv5',
    category: 'bundle',
    includes: [
      'Professional makeup application',
      'Group scheduling priority',
      'On-location service available',
    ],
  },
  {
    id: 'glow-up-bundle',
    name: 'Glow Up Bundle',
    description: 'Book 3 services and save. Perfect for those with multiple events coming up.',
    price: 324,
    originalPrice: 420,
    deposit: 162,
    remainingBalance: 162,
    duration: 'Multiple sessions',
    image: '/IMG_8902.JPG',
    stripePriceId: 'price_1SnNIjEmDDtU2eufafK9cuQU',
    category: 'bundle',
    includes: [
      'Any 3 makeup services',
      'Valid for 6 months from purchase',
      'Transferable to a friend',
      'Priority booking access',
      'Free professional touch-up kit',
    ],
  },
  {
    id: 'vip-experience',
    name: 'VIP Experience',
    description: 'The ultimate pampering session. Private studio with a full glam transformation.',
    price: 480,
    originalPrice: 600,
    deposit: 240,
    remainingBalance: 240,
    duration: '2 hours',
    image: '/IMG_8903.JPG',
    stripePriceId: 'price_1SnNJjEmDDtU2eufAeNtj4Mg',
    category: 'bundle',
    includes: [
      'Private 2-hour exclusive session',
      'Gourmet refreshments provided',
      'Signature Glam full application',
      'One-on-one makeup lesson included',
      'Premium product gift bag ($100 value)',
      'Professional photography session',
    ],
  },
];

// Get all services and bundles
export const getAllServices = (): ServiceConfig[] => [...SERVICES, ...BUNDLES];

// Find service by ID
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return getAllServices().find(service => service.id === id);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
