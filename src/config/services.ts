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
 * 
 * PRICING NOTE: All prices include 20% markup for promotional flexibility.
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
// MAKEUP SERVICES (20% price increase applied)
// ============================================
export const MAKEUP_SERVICES: ServiceConfig[] = [
  {
    id: 'makeup-or-hair',
    name: 'Makeup OR Hair',
    description: 'Choice of makeup (airbrush or traditional) OR a dry hairstyle of your choice. Perfect for simpler occasions.',
    price: 165,
    originalPrice: 200,
    deposit: 82.50,
    remainingBalance: 82.50,
    duration: '45 min',
    image: '/IMG_8863.JPG',
    stripePriceId: 'price_makeup_or_hair',
    category: 'makeup',
    includes: [
      'Choice of makeup OR hair (not both)',
      'Makeup: Airbrush or traditional',
      'Hair: Dry hairstyle of choice',
      'Professional application',
      'Long-lasting setting',
    ],
  },
  {
    id: 'basic-soft-glam',
    name: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition. Perfect for work, casual outings, or everyday elegance.',
    price: 120,
    originalPrice: 150,
    deposit: 60,
    remainingBalance: 60,
    duration: '45 min',
    image: '/basic softglam cover.jpeg',
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
    price: 150,
    originalPrice: 180,
    deposit: 75,
    remainingBalance: 75,
    duration: '60 min',
    image: '/Soft glam2.jpeg',
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
    price: 180,
    originalPrice: 210,
    deposit: 90,
    remainingBalance: 90,
    duration: '75 min',
    image: '/Full glam Cover.jpeg',
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
    price: 216,
    originalPrice: 246,
    deposit: 108,
    remainingBalance: 108,
    duration: '90 min',
    image: '/Signature Glam.jpeg',
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
// HAIR SERVICES (20% price increase applied)
// ============================================
export const HAIR_SERVICES: ServiceConfig[] = [
  {
    id: 'blowout-styling',
    name: 'Blowout & Styling',
    description: 'Professional blowout with smooth, voluminous styling. Perfect for everyday polish or events.',
    price: 90,
    originalPrice: 114,
    deposit: 45,
    remainingBalance: 45,
    duration: '45 min',
    image: '/IMG_8949.JPG',
    stripePriceId: 'price_1SnQNeEmDDtU2eufw1aFZFG9',
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
    price: 144,
    originalPrice: 174,
    deposit: 72,
    remainingBalance: 72,
    duration: '60 min',
    image: '/IMG_8950.JPG',
    stripePriceId: 'price_1SnQNrEmDDtU2eufE8slJIan',
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
    price: 114,
    originalPrice: 138,
    deposit: 57,
    remainingBalance: 57,
    duration: '50 min',
    image: '/IMG_8951.JPG',
    stripePriceId: 'price_1SnQOXEmDDtU2eufi5AlsH5c',
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
    price: 132,
    originalPrice: 162,
    deposit: 66,
    remainingBalance: 66,
    duration: '60 min',
    image: '/IMG_8952.JPG',
    stripePriceId: 'price_1SnQSKEmDDtU2eufEoosl2Pp',
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
    price: 156,
    originalPrice: 186,
    deposit: 78,
    remainingBalance: 78,
    duration: '70 min',
    image: '/IMG_8953.JPG',
    stripePriceId: 'price_1SnQeIEmDDtU2eufutgoWyau',
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
// HAIR + MAKEUP COMBO PACKAGES (20% price increase applied)
// ============================================
export const COMBO_PACKAGES: ServiceConfig[] = [
  {
    id: 'natural-combo',
    name: 'Natural Beauty Combo',
    description: 'Basic Soft Glam makeup + Blowout styling. Perfect everyday elegance package.',
    price: 192,
    originalPrice: 264,
    deposit: 96,
    remainingBalance: 96,
    duration: '90 min',
    image: '/basicsoftglam.jpeg',
    stripePriceId: 'price_1SnQglEmDDtU2eufo8gsFqZs',
    category: 'combo',
    includes: [
      'Basic Soft Glam makeup application',
      'Professional blowout & styling',
      'Coordinated overall look',
      'Long-lasting setting',
      'Save $72 vs booking separately',
    ],
  },
  {
    id: 'event-ready-combo',
    name: 'Event Ready Combo',
    description: 'Full Glam makeup + Formal Updo. Complete transformation for weddings and galas.',
    price: 294,
    originalPrice: 384,
    deposit: 147,
    remainingBalance: 147,
    duration: '2 hours 15 min',
    image: '/full glam.jpeg',
    stripePriceId: 'price_1SnQoHEmDDtU2eufW6YbCIAM',
    category: 'combo',
    popular: true,
    includes: [
      'Full Glam makeup application',
      'Elegant formal updo',
      'Premium lash application',
      'Camera-ready finishing',
      'Save $90 vs booking separately',
    ],
  },
  {
    id: 'signature-combo',
    name: 'Signature Experience Combo',
    description: 'Signature Glam makeup + Hollywood Waves. Ultimate red carpet transformation.',
    price: 336,
    originalPrice: 432,
    deposit: 168,
    remainingBalance: 168,
    duration: '2 hours 40 min',
    image: '/signature glam cover.jpeg',
    stripePriceId: 'price_1SnQqaEmDDtU2eufz8x8UrqQ',
    category: 'combo',
    includes: [
      'Signature Glam makeup artistry',
      'Hollywood waves styling',
      'Touch-up kit included',
      'Photo-ready finishing',
      'Save $96 vs booking separately',
    ],
  },
];

// ============================================
// EVENT-SPECIFIC PACKAGES (20% price increase applied)
// ============================================
export const EVENT_PACKAGES: ServiceConfig[] = [
  {
    id: 'bridal-bride',
    name: 'Bridal Makeup (Bride)',
    description: 'Premium bridal makeup for your special day. Flawless, long-lasting, and photo-ready.',
    price: 240,
    originalPrice: 300,
    deposit: 120,
    remainingBalance: 120,
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
    price: 180,
    originalPrice: 210,
    deposit: 90,
    remainingBalance: 90,
    duration: '90 min',
    image: '/IMG_8957.JPG',
    stripePriceId: 'price_1SnQqwEmDDtU2eufnce6rtbW',
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
    price: 120,
    originalPrice: 150,
    deposit: 60,
    remainingBalance: 60,
    duration: '45 min',
    image: '/bridesmaid glam.jpeg',
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
    price: 210,
    originalPrice: 252,
    deposit: 105,
    remainingBalance: 105,
    duration: '75 min',
    image: '/IMG_8958.JPG',
    stripePriceId: 'price_1SnQrDEmDDtU2eufVOqngoOF',
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
    id: 'bridal-hair-makeup-package',
    name: 'Bridal Hair & Makeup Package',
    description: 'Say "I do" in style. Professional hair styling, custom makeup look, lashes, and a touch-up kit.',
    price: 345,
    originalPrice: 420,
    deposit: 172.50,
    remainingBalance: 172.50,
    duration: '2.5 hours',
    image: '/IMG_8959.JPG',
    stripePriceId: 'price_bridal_hair_makeup',
    category: 'bridal',
    popular: true,
    eventTypes: ['wedding'],
    includes: [
      'Custom bridal makeup application',
      'Professional bridal hairstyling',
      'Choice of airbrush or traditional',
      'Premium lash application',
      'Touch-up kit with beauty goodies',
      'On-location service available',
    ],
  },
  {
    id: 'bridal-complete',
    name: 'Complete Bridal Package',
    description: 'Full bridal experience: Hair + Makeup + Trial. Everything you need for your wedding day.',
    price: 576,
    originalPrice: 762,
    deposit: 288,
    remainingBalance: 288,
    duration: 'Multiple sessions',
    image: '/IMG_8900.JPG',
    stripePriceId: 'price_1SnQrVEmDDtU2eufgWgMRdus',
    category: 'bridal',
    eventTypes: ['wedding'],
    includes: [
      'Bridal makeup trial session',
      'Wedding day bridal makeup',
      'Wedding day bridal hair styling',
      'Premium lash application',
      'Touch-up kit included',
      'On-location service available',
      'Save $186 vs booking separately',
    ],
  },
  {
    id: 'quinceanera',
    name: 'Quinceañera Hair & Makeup',
    description: 'Make your XV años unforgettable. Choice of airbrush or traditional makeup with a hairstyle fit for a princess.',
    price: 315,
    originalPrice: 380,
    deposit: 157.50,
    remainingBalance: 157.50,
    duration: '2 hours',
    image: '/IMG_8960.JPG',
    stripePriceId: 'price_quinceanera',
    category: 'event',
    popular: true,
    eventTypes: ['quinceanera'],
    includes: [
      'Choice of airbrush or traditional makeup',
      'Full glam makeup application',
      'Elegant updo or styling',
      'Crown/tiara placement',
      'Photo-ready finishing',
      'Long-lasting formulas',
    ],
  },
  {
    id: 'quinceanera-court',
    name: 'Quinceañera Court (Per Person)',
    description: 'Professional glam for damas and chambelanes\' dates. Coordinated with the quinceañera.',
    price: 102,
    originalPrice: 126,
    deposit: 51,
    remainingBalance: 51,
    duration: '45 min',
    image: '/IMG_8963.JPG',
    stripePriceId: 'price_1SnREeEmDDtU2eufnSuZPcs9',
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
    price: 210,
    originalPrice: 258,
    deposit: 105,
    remainingBalance: 105,
    duration: '90 min',
    image: '/IMG_8964.JPG',
    stripePriceId: 'price_1SnRFCEmDDtU2eufzumKTlj4',
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
    id: 'senior-year-glam',
    name: 'Senior Year Hair & Makeup',
    description: 'Complete hair and makeup for graduation, senior photos, prom, or other senior events. Look fabulous for your milestone!',
    price: 279,
    originalPrice: 340,
    deposit: 139.50,
    remainingBalance: 139.50,
    duration: '90 min',
    image: '/IMG_8965.JPG',
    stripePriceId: 'price_senior_year_glam',
    category: 'event',
    popular: true,
    eventTypes: ['senior portraits', 'graduation', 'prom'],
    includes: [
      'Full hair styling of choice',
      'Complete makeup application',
      'Choice of airbrush or traditional',
      'Custom lip touch-up kit',
      'Photo-ready finishing',
      'Long-lasting formulas',
    ],
  },
  {
    id: 'senior-portraits',
    name: 'Senior Portrait Session',
    description: 'Natural, photo-ready makeup for senior photos. Look your best for this milestone moment.',
    price: 132,
    originalPrice: 162,
    deposit: 66,
    remainingBalance: 66,
    duration: '60 min',
    image: '/IMG_8966.JPG',
    stripePriceId: 'price_1SnRFvEmDDtU2eufQVrZe6be',
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
    price: 150,
    originalPrice: 180,
    deposit: 75,
    remainingBalance: 75,
    duration: '60 min',
    image: '/IMG_8968.JPG',
    stripePriceId: 'price_1SnRKlEmDDtU2eufeLomTOHn',
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
// BUNDLES & SPECIAL PACKAGES (20% price increase applied)
// ============================================
export const BUNDLES: ServiceConfig[] = [
  {
    id: 'makeup-and-hair-combo',
    name: 'Makeup and Hair',
    description: 'Complete transformation with choice of airbrush or traditional makeup, strip lashes, and hairstyle of your choice.',
    price: 300,
    originalPrice: 360,
    deposit: 150,
    remainingBalance: 150,
    duration: '2 hours',
    image: '/FullGlam2.jpeg',
    stripePriceId: 'price_makeup_and_hair',
    category: 'combo',
    popular: true,
    includes: [
      'Choice of airbrush or traditional makeup',
      'Strip lash application',
      'Hairstyle of your choice',
      'Long-lasting formulas',
      'Photo-ready finish',
      'Group discount: $285/person for 2+',
    ],
  },
  {
    id: 'glow-up-bundle',
    name: 'Glow Up Bundle',
    description: 'Book 3 services and save big. Perfect for those with multiple events coming up.',
    price: 389,
    originalPrice: 504,
    deposit: 194.50,
    remainingBalance: 194.50,
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
    id: 'half-day-rate',
    name: 'Half Day Rate (4 Hours)',
    description: 'Perfect for weddings and events. One artist can complete 4-5 services in 4 hours.',
    price: 900,
    originalPrice: 1080,
    deposit: 450,
    remainingBalance: 450,
    duration: '4 hours',
    image: '/IMG_8955.JPG',
    stripePriceId: 'price_half_day_rate',
    category: 'bundle',
    eventTypes: ['wedding', 'event'],
    includes: [
      '4 hours of dedicated artist time',
      '4-5 services depending on look complexity',
      'Travel included up to 30 miles',
      '$150/hour after 4 hours',
      'On-location service included',
      'Multiple artists available (inquire)',
    ],
  },
  {
    id: 'full-day-rate',
    name: 'Full Day Rate (8 Hours)',
    description: 'Complete event coverage. One artist can complete 7-9 services in 8 hours.',
    price: 1500,
    originalPrice: 1800,
    deposit: 750,
    remainingBalance: 750,
    duration: '8 hours',
    image: '/IMG_8956.JPG',
    stripePriceId: 'price_full_day_rate',
    category: 'bundle',
    eventTypes: ['wedding', 'event'],
    includes: [
      '8 hours of dedicated artist time',
      '7-9 services depending on look complexity',
      'Travel included up to 60 miles',
      '$150/hour after 8 hours',
      '30-minute lunch break included',
      'On-location service included',
      'Multiple artists available (inquire)',
    ],
  },
  {
    id: 'vip-experience',
    name: 'VIP Experience',
    description: 'The ultimate pampering session. Private studio with a full glam transformation.',
    price: 576,
    originalPrice: 720,
    deposit: 288,
    remainingBalance: 288,
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
    price: 432,
    originalPrice: 576,
    deposit: 216,
    remainingBalance: 216,
    duration: '3 hours',
    image: '/IMG_8968.JPG',
    stripePriceId: 'price_1SnRLLEmDDtU2eufgKLBwN7h',
    category: 'bundle',
    includes: [
      '4 Soft Glam makeup applications',
      'Group scheduling priority',
      'Celebratory atmosphere',
      'Photo session coordination',
      'Save $144 vs individual bookings',
    ],
  },
];

// ============================================
// ADD-ON SERVICES (20% price increase applied)
// ============================================
export const ADDONS: AddOnService[] = [
  // Makeup Add-Ons
  {
    id: 'airbrush-upgrade',
    name: 'Airbrush Makeup Upgrade',
    description: 'Upgrade to flawless airbrush application for ultra-smooth, long-lasting coverage.',
    price: 42,
    category: 'makeup',
  },
  {
    id: 'ombre-lips',
    name: 'Ombre Lips',
    description: 'Gradient lip color technique for dimension and fullness.',
    price: 22,
    category: 'makeup',
  },
  {
    id: 'winged-eyeliner',
    name: 'Winged Eyeliner / Premium Lashes',
    description: 'Precision winged eyeliner with enhanced lash application.',
    price: 22,
    category: 'makeup',
  },
  {
    id: 'highlighter-upgrade',
    name: 'Highlighter Upgrade',
    description: 'Premium highlighter application for enhanced glow.',
    price: 14,
    category: 'makeup',
  },
  {
    id: 'contour-upgrade',
    name: 'Contour Upgrade',
    description: 'Advanced contouring techniques for superior definition.',
    price: 14,
    category: 'makeup',
  },
  {
    id: 'glitter-gems',
    name: 'Glitter & Gems Application',
    description: 'Face jewels, gems, or glitter accents for statement looks.',
    price: 24,
    priceRange: '$14-29',
    category: 'makeup',
  },
  {
    id: 'scarf-setting',
    name: 'Scarf Setting',
    description: 'Traditional scarf wrapping technique for flawless, long-lasting makeup.',
    price: 18,
    priceRange: '$14-22',
    category: 'makeup',
  },
  // Hair Add-Ons
  {
    id: 'hair-extensions',
    name: 'Clip-In Extensions Styling',
    description: 'Professional application and styling of clip-in hair extensions.',
    price: 60,
    priceRange: '$48-90',
    category: 'hair',
  },
  {
    id: 'hair-accessories',
    name: 'Hair Accessory Placement',
    description: 'Expert placement of veils, tiaras, flowers, or other accessories.',
    price: 30,
    category: 'hair',
  },
  {
    id: 'texture-treatment',
    name: 'Texture & Volume Treatment',
    description: 'Extra texturizing and volume enhancement for fuller styles.',
    price: 24,
    category: 'hair',
  },
  // General Add-Ons (Travel & Extras)
  {
    id: 'travel-fee-local',
    name: 'On-Location (0-20 miles)',
    description: 'Minimum travel fee for on-location appointments. We come to you!',
    price: 60,
    category: 'general',
  },
  {
    id: 'travel-fee-extended',
    name: 'On-Location (20-40 miles)',
    description: 'Extended travel for on-location services.',
    price: 100,
    category: 'general',
  },
  {
    id: 'travel-fee-far',
    name: 'On-Location (40-60 miles)',
    description: 'Long-distance travel for on-location services.',
    price: 150,
    category: 'general',
  },
  {
    id: 'early-morning',
    name: 'Early Morning Fee',
    description: 'Appointments starting before 8 AM.',
    price: 48,
    category: 'general',
  },
  {
    id: 'touch-up-kit',
    name: 'Touch-Up Kit',
    description: 'Take-home kit with lip color, blotting papers, and setting spray.',
    price: 30,
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
