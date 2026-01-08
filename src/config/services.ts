/**
 * COMPREHENSIVE SERVICES CONFIGURATION
 * 
 * This file contains all service definitions including:
 * - Makeup services (various glam levels)
 * - Hair services (styling, updos, blowouts)
 * - Hair + Makeup combo packages
 * - Add-on services
 * - Travel/on-location fees
 * - Event-specific packages (Bridal, Quinceañera, Prom, etc.)
 * 
 * The deposit system collects 50% upfront, with the remaining balance due in person.
 */

export type ServiceCategory = 
  | 'makeup' 
  | 'hair' 
  | 'combo' 
  | 'addon' 
  | 'bridal' 
  | 'event' 
  | 'bundle';

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
  category: ServiceCategory;
  includes?: string[];
  popular?: boolean;
  eventTypes?: string[];
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  category: 'makeup' | 'hair' | 'general';
}

// ============================================
// MAKEUP SERVICES
// ============================================
export const MAKEUP_SERVICES: ServiceConfig[] = [
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
    category: 'makeup',
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
    category: 'makeup',
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
    description: 'Premium show-stopping glamour with intricate artistry for red carpet events and editorials.',
    price: 180,
    originalPrice: 205,
    deposit: 90,
    remainingBalance: 90,
    duration: '90 min',
    image: '/IMG_8912.JPG',
    stripePriceId: 'price_1SnNGcEmDDtU2eufzbO51FUU',
    category: 'makeup',
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

// ============================================
// HAIR SERVICES
// ============================================
export const HAIR_SERVICES: ServiceConfig[] = [
  {
    id: 'blowout-styling',
    name: 'Blowout & Styling',
    description: 'Professional blowout with smooth, voluminous styling. Perfect for everyday polish or events.',
    price: 75,
    originalPrice: 95,
    deposit: 37.50,
    remainingBalance: 37.50,
    duration: '45 min',
    image: '/IMG_8949.JPG',
    stripePriceId: '', // To be created
    category: 'hair',
    includes: [
      'Hair consultation',
      'Professional shampoo & conditioning',
      'Heat protection application',
      'Blowout with round brush technique',
      'Smooth or voluminous finish',
      'Light hold finishing spray',
    ],
  },
  {
    id: 'formal-updo',
    name: 'Formal Updo',
    description: 'Elegant updo styling for weddings, galas, and formal events. Classic or modern designs.',
    price: 120,
    originalPrice: 145,
    deposit: 60,
    remainingBalance: 60,
    duration: '60 min',
    image: '/IMG_8950.JPG',
    stripePriceId: '', // To be created
    category: 'hair',
    popular: true,
    includes: [
      'Style consultation',
      'Hair preparation & texturizing',
      'Elegant updo creation',
      'Secure pinning for all-day hold',
      'Finishing spray & polish',
      'Style touch-up guidance',
    ],
  },
  {
    id: 'half-up-half-down',
    name: 'Half-Up Half-Down',
    description: 'Romantic half-up styling with curls or waves. Perfect blend of elegant and effortless.',
    price: 95,
    originalPrice: 115,
    deposit: 47.50,
    remainingBalance: 47.50,
    duration: '50 min',
    image: '/IMG_8951.JPG',
    stripePriceId: '', // To be created
    category: 'hair',
    includes: [
      'Style consultation',
      'Curling or waving technique',
      'Half-up styling with volume',
      'Secure placement',
      'Finishing touches & spray',
    ],
  },
  {
    id: 'braided-styling',
    name: 'Braided Styling',
    description: 'Intricate braided looks from boho braids to elegant French styles. Perfect for any occasion.',
    price: 110,
    originalPrice: 135,
    deposit: 55,
    remainingBalance: 55,
    duration: '60 min',
    image: '/IMG_8952.JPG',
    stripePriceId: '', // To be created
    category: 'hair',
    includes: [
      'Braid style consultation',
      'Hair preparation & texturizing',
      'Custom braided design',
      'Secure finishing',
      'Decorative accents (optional)',
      'Long-lasting hold spray',
    ],
  },
  {
    id: 'hollywood-waves',
    name: 'Hollywood Waves',
    description: 'Classic glamorous waves inspired by old Hollywood. Timeless elegance for special events.',
    price: 130,
    originalPrice: 155,
    deposit: 65,
    remainingBalance: 65,
    duration: '70 min',
    image: '/IMG_8953.JPG',
    stripePriceId: '', // To be created
    category: 'hair',
    includes: [
      'Hair preparation & heat protection',
      'Precision wave setting',
      'Brush-out for seamless waves',
      'High-shine finishing',
      'All-day hold styling spray',
    ],
  },
];

// ============================================
// HAIR + MAKEUP COMBO PACKAGES
// ============================================
export const COMBO_PACKAGES: ServiceConfig[] = [
  {
    id: 'natural-combo',
    name: 'Natural Beauty Combo',
    description: 'Basic Soft Glam makeup + Blowout styling. Perfect everyday elegance package.',
    price: 160,
    originalPrice: 220,
    deposit: 80,
    remainingBalance: 80,
    duration: '90 min',
    image: '/IMG_8954.JPG',
    stripePriceId: '', // To be created
    category: 'combo',
    includes: [
      'Basic Soft Glam makeup application',
      'Professional blowout & styling',
      'Coordinated overall look',
      'Long-lasting setting',
      'Save $60 vs booking separately',
    ],
  },
  {
    id: 'event-ready-combo',
    name: 'Event Ready Combo',
    description: 'Full Glam makeup + Formal Updo. Complete transformation for weddings and galas.',
    price: 245,
    originalPrice: 320,
    deposit: 122.50,
    remainingBalance: 122.50,
    duration: '2 hours 15 min',
    image: '/IMG_8955.JPG',
    stripePriceId: '', // To be created
    category: 'combo',
    popular: true,
    includes: [
      'Full Glam makeup application',
      'Elegant formal updo',
      'Premium lash application',
      'Camera-ready finishing',
      'Save $75 vs booking separately',
    ],
  },
  {
    id: 'signature-combo',
    name: 'Signature Experience Combo',
    description: 'Signature Glam makeup + Hollywood Waves. Ultimate red carpet transformation.',
    price: 280,
    originalPrice: 360,
    deposit: 140,
    remainingBalance: 140,
    duration: '2 hours 40 min',
    image: '/IMG_8956.JPG',
    stripePriceId: '', // To be created
    category: 'combo',
    includes: [
      'Signature Glam makeup artistry',
      'Hollywood waves styling',
      'Touch-up kit included',
      'Photo-ready finishing',
      'Save $80 vs booking separately',
    ],
  },
];

// ============================================
// EVENT-SPECIFIC PACKAGES
// ============================================
export const EVENT_PACKAGES: ServiceConfig[] = [
  {
    id: 'bridal-bride',
    name: 'Bridal Makeup (Bride)',
    description: 'Premium bridal makeup for your special day. Flawless, long-lasting, and photo-ready.',
    price: 200,
    originalPrice: 250,
    deposit: 100,
    remainingBalance: 100,
    duration: '90 min',
    image: '/IMG_8900.JPG',
    stripePriceId: 'price_1SnNHhEmDDtU2eufxHcrH6BU',
    category: 'bridal',
    eventTypes: ['wedding'],
    includes: [
      'Pre-wedding consultation',
      'Premium bridal makeup application',
      'Long-wear formulas for all-day perfection',
      'False lash application',
      'Touch-up kit for the day',
      'On-location service available',
    ],
  },
  {
    id: 'bridal-trial',
    name: 'Bridal Trial',
    description: 'Test your wedding day look before the big day. Includes full makeup application and photos.',
    price: 150,
    originalPrice: 175,
    deposit: 75,
    remainingBalance: 75,
    duration: '90 min',
    image: '/IMG_8957.JPG',
    stripePriceId: '', // To be created
    category: 'bridal',
    eventTypes: ['wedding'],
    includes: [
      'Detailed consultation',
      'Full bridal makeup application',
      'Multiple look options',
      'Product recommendations',
      'Trial photos for reference',
      'Notes for wedding day artist',
    ],
  },
  {
    id: 'bridal-party-member',
    name: 'Bridal Party (Per Person)',
    description: 'Professional makeup for bridesmaids, mothers, and family members. Flat rate per person.',
    price: 100,
    originalPrice: 125,
    deposit: 50,
    remainingBalance: 50,
    duration: '45 min',
    image: '/IMG_8901.JPG',
    stripePriceId: 'price_1SnNI1EmDDtU2eufW5983nv5',
    category: 'bridal',
    eventTypes: ['wedding'],
    includes: [
      'Professional makeup application',
      'Complimentary lash application',
      'Coordinated with bridal party look',
      'Long-lasting setting',
    ],
  },
  {
    id: 'bridal-hair-bride',
    name: 'Bridal Hair (Bride)',
    description: 'Stunning bridal hairstyling. From elegant updos to romantic waves.',
    price: 175,
    originalPrice: 210,
    deposit: 87.50,
    remainingBalance: 87.50,
    duration: '75 min',
    image: '/IMG_8958.JPG',
    stripePriceId: '', // To be created
    category: 'bridal',
    eventTypes: ['wedding'],
    includes: [
      'Bridal hair consultation',
      'Custom styling for your dress & veil',
      'Secure all-day hold',
      'Accessory placement',
      'Touch-up guidance',
    ],
  },
  {
    id: 'bridal-complete',
    name: 'Complete Bridal Package',
    description: 'Full bridal experience: Hair + Makeup + Trial. Everything you need for your wedding day.',
    price: 480,
    originalPrice: 635,
    deposit: 240,
    remainingBalance: 240,
    duration: 'Multiple sessions',
    image: '/IMG_8959.JPG',
    stripePriceId: '', // To be created
    category: 'bridal',
    popular: true,
    eventTypes: ['wedding'],
    includes: [
      'Bridal makeup trial session',
      'Wedding day bridal makeup',
      'Wedding day bridal hair styling',
      'Premium lash application',
      'Touch-up kit included',
      'On-location service available',
      'Save $155 vs booking separately',
    ],
  },
  {
    id: 'quinceanera',
    name: 'Quinceañera Glam',
    description: 'Make your XV años unforgettable with stunning hair and makeup for the quinceañera.',
    price: 225,
    originalPrice: 280,
    deposit: 112.50,
    remainingBalance: 112.50,
    duration: '2 hours',
    image: '/IMG_8960.JPG',
    stripePriceId: '', // To be created
    category: 'event',
    eventTypes: ['quinceanera'],
    includes: [
      'Full glam makeup application',
      'Elegant updo or styling',
      'Crown/tiara placement',
      'Photo-ready finishing',
      'Long-lasting formulas',
      'Touch-up kit for the party',
    ],
  },
  {
    id: 'quinceanera-court',
    name: 'Quinceañera Court (Per Person)',
    description: 'Professional glam for damas and chambelanes\' dates. Coordinated with the quinceañera.',
    price: 85,
    originalPrice: 105,
    deposit: 42.50,
    remainingBalance: 42.50,
    duration: '45 min',
    image: '/IMG_8963.JPG',
    stripePriceId: '', // To be created
    category: 'event',
    eventTypes: ['quinceanera'],
    includes: [
      'Event makeup application',
      'Basic styling or blowout',
      'Coordinated look',
      'Setting spray finish',
    ],
  },
  {
    id: 'prom-glam',
    name: 'Prom Glam',
    description: 'Stand out at prom with professional hair and makeup. Perfect for photos and dancing all night.',
    price: 175,
    originalPrice: 215,
    deposit: 87.50,
    remainingBalance: 87.50,
    duration: '90 min',
    image: '/IMG_8964.JPG',
    stripePriceId: '', // To be created
    category: 'event',
    eventTypes: ['prom', 'homecoming'],
    includes: [
      'Event glam makeup',
      'Formal hairstyling',
      'Complimentary lashes',
      'Long-lasting setting',
      'Perfect for photos',
    ],
  },
  {
    id: 'senior-portraits',
    name: 'Senior Portrait Session',
    description: 'Natural, photo-ready makeup for senior photos. Look your best for this milestone moment.',
    price: 110,
    originalPrice: 135,
    deposit: 55,
    remainingBalance: 55,
    duration: '60 min',
    image: '/IMG_8965.JPG',
    stripePriceId: '', // To be created
    category: 'event',
    eventTypes: ['senior portraits', 'photoshoot'],
    includes: [
      'Natural glam makeup',
      'Photo-optimized application',
      'Multiple look touch-ups',
      'Mattifying for camera',
    ],
  },
  {
    id: 'maternity-glam',
    name: 'Maternity Session',
    description: 'Glow beautifully for your maternity photos. Gentle products safe for pregnancy.',
    price: 125,
    originalPrice: 150,
    deposit: 62.50,
    remainingBalance: 62.50,
    duration: '60 min',
    image: '/IMG_8966.JPG',
    stripePriceId: '', // To be created
    category: 'event',
    eventTypes: ['maternity', 'photoshoot'],
    includes: [
      'Pregnancy-safe products',
      'Soft glam makeup',
      'Enhanced natural glow',
      'Optional light styling',
      'Photo-ready finish',
    ],
  },
];

// ============================================
// BUNDLES & SPECIAL PACKAGES
// ============================================
export const BUNDLES: ServiceConfig[] = [
  {
    id: 'glow-up-bundle',
    name: 'Glow Up Bundle',
    description: 'Book 3 services and save big. Perfect for those with multiple events coming up.',
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
    duration: '2.5 hours',
    image: '/IMG_8903.JPG',
    stripePriceId: 'price_1SnNJjEmDDtU2eufAeNtj4Mg',
    category: 'bundle',
    includes: [
      'Private exclusive session',
      'Gourmet refreshments provided',
      'Signature Glam makeup',
      'Premium hair styling',
      'One-on-one beauty lesson',
      'Premium product gift bag ($100 value)',
      'Professional photography session',
    ],
  },
  {
    id: 'group-glam-4',
    name: 'Group Glam (4 People)',
    description: 'Perfect for girls\' night, birthdays, or bachelorette parties. Includes 4 makeup services.',
    price: 360,
    originalPrice: 480,
    deposit: 180,
    remainingBalance: 180,
    duration: '3 hours',
    image: '/IMG_8968.JPG',
    stripePriceId: '', // To be created
    category: 'bundle',
    includes: [
      '4 Soft Glam makeup applications',
      'Group scheduling priority',
      'Celebratory atmosphere',
      'Photo session coordination',
      'Save $120 vs individual bookings',
    ],
  },
];

// ============================================
// ADD-ON SERVICES
// ============================================
export const ADDONS: AddOnService[] = [
  // Makeup Add-Ons
  {
    id: 'airbrush-upgrade',
    name: 'Airbrush Makeup Upgrade',
    description: 'Upgrade to flawless airbrush application for ultra-smooth, long-lasting coverage.',
    price: 35,
    category: 'makeup',
  },
  {
    id: 'ombre-lips',
    name: 'Ombre Lips',
    description: 'Gradient lip color technique for dimension and fullness.',
    price: 18,
    category: 'makeup',
  },
  {
    id: 'winged-eyeliner',
    name: 'Winged Eyeliner / Premium Lashes',
    description: 'Precision winged eyeliner with enhanced lash application.',
    price: 18,
    category: 'makeup',
  },
  {
    id: 'highlighter-upgrade',
    name: 'Highlighter Upgrade',
    description: 'Premium highlighter application for enhanced glow.',
    price: 12,
    category: 'makeup',
  },
  {
    id: 'contour-upgrade',
    name: 'Contour Upgrade',
    description: 'Advanced contouring techniques for superior definition.',
    price: 12,
    category: 'makeup',
  },
  {
    id: 'glitter-gems',
    name: 'Glitter & Gems Application',
    description: 'Face jewels, gems, or glitter accents for statement looks.',
    price: 20,
    priceRange: '$12-24',
    category: 'makeup',
  },
  {
    id: 'scarf-setting',
    name: 'Scarf Setting',
    description: 'Traditional scarf wrapping technique for flawless, long-lasting makeup.',
    price: 15,
    priceRange: '$12-18',
    category: 'makeup',
  },
  // Hair Add-Ons
  {
    id: 'hair-extensions',
    name: 'Clip-In Extensions Styling',
    description: 'Professional application and styling of clip-in hair extensions.',
    price: 50,
    priceRange: '$40-75',
    category: 'hair',
  },
  {
    id: 'hair-accessories',
    name: 'Hair Accessory Placement',
    description: 'Expert placement of veils, tiaras, flowers, or other accessories.',
    price: 25,
    category: 'hair',
  },
  {
    id: 'texture-treatment',
    name: 'Texture & Volume Treatment',
    description: 'Extra texturizing and volume enhancement for fuller styles.',
    price: 20,
    category: 'hair',
  },
  // General Add-Ons
  {
    id: 'travel-fee-local',
    name: 'On-Location Service (0-15 miles)',
    description: 'We come to you! Travel fee for local on-location services.',
    price: 35,
    category: 'general',
  },
  {
    id: 'travel-fee-extended',
    name: 'On-Location Service (15-30 miles)',
    description: 'Extended travel for on-location services.',
    price: 65,
    category: 'general',
  },
  {
    id: 'early-morning',
    name: 'Early Morning Fee',
    description: 'Appointments starting before 8 AM.',
    price: 40,
    category: 'general',
  },
  {
    id: 'touch-up-kit',
    name: 'Touch-Up Kit',
    description: 'Take-home kit with lip color, blotting papers, and setting spray.',
    price: 25,
    category: 'general',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all main services (excluding add-ons)
export const getAllServices = (): ServiceConfig[] => [
  ...MAKEUP_SERVICES,
  ...HAIR_SERVICES,
  ...COMBO_PACKAGES,
  ...EVENT_PACKAGES,
  ...BUNDLES,
];

// Get services by category
export const getServicesByCategory = (category: ServiceCategory): ServiceConfig[] => {
  return getAllServices().filter(service => service.category === category);
};

// Get popular services
export const getPopularServices = (): ServiceConfig[] => {
  return getAllServices().filter(service => service.popular);
};

// Get services for specific event type
export const getServicesForEvent = (eventType: string): ServiceConfig[] => {
  return getAllServices().filter(
    service => service.eventTypes?.includes(eventType.toLowerCase())
  );
};

// Find service by ID
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return getAllServices().find(service => service.id === id);
};

// Find add-on by ID
export const getAddOnById = (id: string): AddOnService | undefined => {
  return ADDONS.find(addon => addon.id === id);
};

// Get add-ons by category
export const getAddOnsByCategory = (category: 'makeup' | 'hair' | 'general'): AddOnService[] => {
  return ADDONS.filter(addon => addon.category === category);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Calculate savings
export const calculateSavings = (original: number, current: number): number => {
  return original - current;
};

// Legacy exports for backwards compatibility
export const SERVICES = MAKEUP_SERVICES;
