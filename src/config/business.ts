/**
 * BUSINESS CONFIGURATION - SINGLE SOURCE OF TRUTH
 *
 * ⚠️ CRITICAL: Update all values below with real business information before launch
 *
 * This file centralizes all business data used throughout the site.
 * Update once here, and all components automatically use the correct information.
 */

export const BUSINESS_CONFIG = {
  // ========================================
  // BUSINESS IDENTITY
  // ========================================
  name: {
    full: 'HDA Studio',
    short: 'HDA',
    legal: 'HDA Studio LLC', // Update with legal entity name
  },

  // ========================================
  // CONTACT INFORMATION
  // ========================================
  contact: {
    phone: {
      display: '(832) 907-0199',
      raw: '+18329070199', // E.164 format for tel: links and Schema
      whatsapp: '18329070199', // WhatsApp format (no + or spaces)
    },

    email: {
      primary: 'Hdastudio143@gmail.com',
      info: 'Hdastudio143@gmail.com',
      bookings: 'Hdastudio143@gmail.com',
    },

    // Service area-based location (no public street address)
    address: {
      // Keep basic locality fields for consistency + structured data
      street: 'Houston, TX',
      suite: '', // Optional
      city: 'Houston',
      state: 'TX',
      stateFullName: 'Texas',
      zip: '',
      country: 'United States',
      countryCode: 'US',

      // Display copy
      serviceArea: 'Houston, TX & surrounding areas',
      vipTravel: 'VIP travel available',

      // Full formatted address for display
      get full() {
        return `${this.serviceArea}. ${this.vipTravel}.`;
      },

      // One-line format
      get oneLine() {
        return `${this.serviceArea} • ${this.vipTravel}`;
      },

      // Google Maps link (centered on service area)
      get mapLink() {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.serviceArea)}`;
      },
    },

    // 🚨 REPLACE WITH REAL COORDINATES (Get from Google Maps)
    geo: {
      latitude: 29.7604, // Houston, TX
      longitude: -95.3698,
    },
  },

  // ========================================
  // BUSINESS HOURS
  // ========================================
  hours: {
    // On-call / by appointment
    regular: {
      monday: { open: '00:00', close: '23:59', isOpen: true },
      tuesday: { open: '00:00', close: '23:59', isOpen: true },
      wednesday: { open: '00:00', close: '23:59', isOpen: true },
      thursday: { open: '00:00', close: '23:59', isOpen: true },
      friday: { open: '00:00', close: '23:59', isOpen: true },
      saturday: { open: '00:00', close: '23:59', isOpen: true },
      sunday: { open: '00:00', close: '23:59', isOpen: true },
    },

    // Schema.org format for structured data
    get schemaFormat() {
      return [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      ];
    },

    // Human-readable format
    get display() {
      return {
        weekdays: 'On-call (by appointment)',
        saturday: 'On-call (by appointment)',
        sunday: 'On-call (by appointment)',
      };
    },
  },

  // ========================================
  // SOCIAL MEDIA
  // ========================================
  social: {
    // 🚨 REPLACE WITH REAL SOCIAL MEDIA HANDLES/URLS
    instagram: {
      handle: '@hda_studio',
      url: 'https://www.instagram.com/hda_studio/',
      enabled: true, // Set to false to hide if not active
    },
    facebook: {
      handle: 'HDA Studio',
      url: 'https://www.facebook.com/hdastudio',
      enabled: true,
    },
    tiktok: {
      handle: '@hdastudio',
      url: 'https://www.tiktok.com/@hdastudio',
      enabled: true,
    },
    twitter: {
      handle: '@hdastudio',
      url: 'https://twitter.com/hdastudio',
      enabled: false, // Optional platform
    },
    youtube: {
      handle: 'HDA Studio',
      url: 'https://www.youtube.com/@hdastudio',
      enabled: false, // Optional platform
    },
  },

  // ========================================
  // WEBSITE & BRANDING
  // ========================================
  website: {
    url: 'https://hdastudio.com',
    domain: 'hdastudio.com',

    // SEO defaults
    seo: {
      defaultTitle: 'HDA Studio | Luxury Beauty & Makeup Artistry',
      defaultDescription: 'Experience luxury beauty services at HDA Studio. Professional makeup artistry from $90. Transform your look with expert glam services for all occasions.',
      keywords: 'makeup artist, beauty services, glam makeup, professional makeup, bridal makeup, event makeup, luxury beauty, makeup studio',
    },

    // Logo paths (update after uploading logo files)
    logo: {
      main: '/logo.png', // Primary logo (512x512 recommended)
      white: '/logo-white.png', // White version for dark backgrounds
      mark: '/logo-mark.png', // Icon/symbol only
      favicon: '/favicon.ico',
    },
  },

  // ========================================
  // BUSINESS DETAILS
  // ========================================
  details: {
    established: 2020, // Year business was founded
    tagline: 'Elevate Your Natural Beauty',
    description: 'Luxury beauty services crafted with precision and artistry. Transform your look with our expert makeup artists in an elegant, intimate setting.',

    // Service area (for local SEO)
    serviceArea: {
      primary: 'Houston, TX',
      radius: 25, // Miles
      regions: ['Houston', 'The Woodlands', 'Sugar Land', 'Katy', 'Pearland'],
    },

    // Ratings (update with real data)
    rating: {
      value: 4.9,
      count: 127,
      maxRating: 5,
    },

    // Price range for Schema
    priceRange: '$90-$480',

    // Accepts
    accepts: {
      reservations: true,
      walkins: false,
      paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Apple Pay', 'Google Pay'],
    },
  },

  // ========================================
  // ANALYTICS & TRACKING
  // ========================================
  analytics: {
    // 🚨 ADD YOUR TRACKING IDs
    googleAnalytics: {
      measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
      enabled: false, // Set to true after adding real ID
    },
    googleTagManager: {
      containerId: 'GTM-XXXXXXX', // Replace with your GTM ID
      enabled: false,
    },
    metaPixel: {
      pixelId: '1234567890', // Replace with your Meta Pixel ID
      enabled: false,
    },
    googleAds: {
      conversionId: 'AW-XXXXXXXXX',
      enabled: false,
    },
  },

  // ========================================
  // LEGAL & COMPLIANCE
  // ========================================
  legal: {
    privacyPolicyUrl: '/privacy-policy',
    termsOfServiceUrl: '/terms-of-service',
    cookiePolicyUrl: '/privacy-policy#cookies',

    // Business registration (optional)
    registration: {
      businessLicense: '',
      taxId: '',
    },
  },
} as const;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get all active social media links
 */
export const getActiveSocialLinks = () => {
  return Object.entries(BUSINESS_CONFIG.social)
    .filter(([_, platform]) => platform.enabled)
    .map(([name, platform]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      url: platform.url,
      handle: platform.handle,
    }));
};

/**
 * Get formatted phone number for display
 */
export const getPhoneDisplay = () => BUSINESS_CONFIG.contact.phone.display;

/**
 * Get phone number for tel: links
 */
export const getPhoneTel = () => BUSINESS_CONFIG.contact.phone.raw;

/**
 * Get WhatsApp link
 */
export const getWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${BUSINESS_CONFIG.contact.phone.whatsapp}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

/**
 * Check if currently within business hours
 */
export const isCurrentlyOpen = (): boolean => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  const todayHours = BUSINESS_CONFIG.hours.regular[dayName as keyof typeof BUSINESS_CONFIG.hours.regular];

  if (!todayHours?.isOpen) return false;

  return currentTime >= (todayHours.open || '') && currentTime <= (todayHours.close || '');
};

/**
 * Get full address for Schema.org
 */
export const getSchemaAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: BUSINESS_CONFIG.contact.address.street,
  addressLocality: BUSINESS_CONFIG.contact.address.city,
  addressRegion: BUSINESS_CONFIG.contact.address.state,
  postalCode: BUSINESS_CONFIG.contact.address.zip,
  addressCountry: BUSINESS_CONFIG.contact.address.countryCode,
});

// Export type for TypeScript autocomplete
export type BusinessConfig = typeof BUSINESS_CONFIG;
