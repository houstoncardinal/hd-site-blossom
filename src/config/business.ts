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
    // 🚨 REPLACE WITH REAL PHONE NUMBER
    phone: {
      display: '(555) 123-4567', // Format for display: (555) 123-4567
      raw: '+15551234567', // E.164 format for tel: links and Schema
      whatsapp: '15551234567', // WhatsApp format (no + or spaces)
    },

    // 🚨 REPLACE WITH REAL EMAIL
    email: {
      primary: 'hello@hdastudio.com',
      info: 'info@hdastudio.com',
      bookings: 'bookings@hdastudio.com',
    },

    // 🚨 REPLACE WITH REAL ADDRESS
    address: {
      street: '123 Beauty Lane',
      suite: 'Suite 100', // Optional
      city: 'Los Angeles',
      state: 'CA',
      stateFullName: 'California',
      zip: '90210',
      country: 'United States',
      countryCode: 'US',

      // Full formatted address for display
      get full() {
        return this.suite
          ? `${this.street}, ${this.suite}, ${this.city}, ${this.state} ${this.zip}`
          : `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
      },

      // One-line format
      get oneLine() {
        return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
      },

      // Google Maps link
      get mapLink() {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.full)}`;
      },
    },

    // 🚨 REPLACE WITH REAL COORDINATES (Get from Google Maps)
    geo: {
      latitude: 34.0522, // Los Angeles example
      longitude: -118.2437,
    },
  },

  // ========================================
  // BUSINESS HOURS
  // ========================================
  hours: {
    // 🚨 UPDATE WITH REAL OPERATING HOURS
    regular: {
      monday: { open: '09:00', close: '19:00', isOpen: true },
      tuesday: { open: '09:00', close: '19:00', isOpen: true },
      wednesday: { open: '09:00', close: '19:00', isOpen: true },
      thursday: { open: '09:00', close: '19:00', isOpen: true },
      friday: { open: '09:00', close: '19:00', isOpen: true },
      saturday: { open: '10:00', close: '18:00', isOpen: true },
      sunday: { open: null, close: null, isOpen: false },
    },

    // Schema.org format for structured data
    get schemaFormat() {
      return [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '18:00',
        },
      ];
    },

    // Human-readable format
    get display() {
      return {
        weekdays: 'Monday - Friday: 9:00 AM - 7:00 PM',
        saturday: 'Saturday: 10:00 AM - 6:00 PM',
        sunday: 'Sunday: Closed',
      };
    },
  },

  // ========================================
  // SOCIAL MEDIA
  // ========================================
  social: {
    // 🚨 REPLACE WITH REAL SOCIAL MEDIA HANDLES/URLS
    instagram: {
      handle: '@hdastudio',
      url: 'https://www.instagram.com/hdastudio',
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
      primary: 'Los Angeles, CA',
      radius: 25, // Miles
      regions: ['Los Angeles', 'Beverly Hills', 'Santa Monica', 'West Hollywood'],
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
