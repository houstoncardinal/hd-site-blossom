import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG, getSchemaAddress, getActiveSocialLinks } from '@/config/business';

/**
 * Advanced Schema Markup for maximum SEO impact
 * Includes: WebSite, LocalBusiness, Service, Review snippets
 */
const AdvancedSchemas = () => {
  // WebSite Schema with SearchAction for sitelinks searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS_CONFIG.website.url}/#website`,
    "name": BUSINESS_CONFIG.name.full,
    "alternateName": ["HDA", "HDA Beauty", "HDA Makeup Studio"],
    "url": BUSINESS_CONFIG.website.url,
    "description": BUSINESS_CONFIG.details.description,
    "publisher": {
      "@id": `${BUSINESS_CONFIG.website.url}/#organization`
    },
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BUSINESS_CONFIG.website.url}/services?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Enhanced LocalBusiness with all rich snippets
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["BeautySalon", "LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `${BUSINESS_CONFIG.website.url}/#organization`,
    "name": BUSINESS_CONFIG.name.full,
    "alternateName": `${BUSINESS_CONFIG.name.full} Beauty & Makeup Studio`,
    "legalName": BUSINESS_CONFIG.name.legal,
    "description": BUSINESS_CONFIG.details.description,
    "slogan": BUSINESS_CONFIG.details.tagline,
    "url": BUSINESS_CONFIG.website.url,
    "logo": {
      "@type": "ImageObject",
      "@id": `${BUSINESS_CONFIG.website.url}/#logo`,
      "url": `${BUSINESS_CONFIG.website.url}/favicon.png`,
      "contentUrl": `${BUSINESS_CONFIG.website.url}/favicon.png`,
      "width": 512,
      "height": 512,
      "caption": `${BUSINESS_CONFIG.name.full} Logo`
    },
    "image": {
      "@type": "ImageObject",
      "url": `${BUSINESS_CONFIG.website.url}/IMG_8915.JPG`,
      "width": 1200,
      "height": 800
    },
    "photo": [
      `${BUSINESS_CONFIG.website.url}/IMG_8915.JPG`,
      `${BUSINESS_CONFIG.website.url}/IMG_8910.JPG`,
      `${BUSINESS_CONFIG.website.url}/IMG_8865.JPG`,
      `${BUSINESS_CONFIG.website.url}/IMG_8900.JPG`
    ],
    "telephone": BUSINESS_CONFIG.contact.phone.raw,
    "email": BUSINESS_CONFIG.contact.email.primary,
    "address": getSchemaAddress(),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_CONFIG.contact.geo.latitude,
      "longitude": BUSINESS_CONFIG.contact.geo.longitude
    },
    "hasMap": BUSINESS_CONFIG.contact.address.mapLink,
    "openingHoursSpecification": BUSINESS_CONFIG.hours.schemaFormat,
    "priceRange": BUSINESS_CONFIG.details.priceRange,
    "currenciesAccepted": "USD",
    "paymentAccepted": BUSINESS_CONFIG.details.accepts.paymentMethods.join(", "),
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": BUSINESS_CONFIG.contact.geo.latitude,
        "longitude": BUSINESS_CONFIG.contact.geo.longitude
      },
      "geoRadius": `${BUSINESS_CONFIG.details.serviceArea.radius} mi`
    },
    "serviceArea": BUSINESS_CONFIG.details.serviceArea.regions.map(region => ({
      "@type": "City",
      "name": region,
      "containedInPlace": {
        "@type": "State",
        "name": "Texas"
      }
    })),
    "foundingDate": BUSINESS_CONFIG.details.established.toString(),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": BUSINESS_CONFIG.details.rating.value,
      "reviewCount": BUSINESS_CONFIG.details.rating.count,
      "bestRating": 5,
      "worstRating": 1
    },
    "sameAs": getActiveSocialLinks().map(link => link.url),
    "knowsAbout": [
      "Makeup Artistry",
      "Bridal Makeup",
      "Glam Makeup",
      "Event Makeup",
      "Editorial Makeup",
      "Natural Makeup",
      "Airbrush Makeup",
      "Celebrity Makeup"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Basic Soft Glam",
          "description": "Natural, polished makeup look perfect for everyday elegance"
        },
        "price": "90",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Soft Glam",
          "description": "Enhanced everyday glam with gentle definition"
        },
        "price": "108",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Standard Glam",
          "description": "Event-ready glamour for weddings and special occasions"
        },
        "price": "144",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Signature Glam",
          "description": "Premium show-stopping glamour for red carpet events"
        },
        "price": "180",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Bridal Package",
          "description": "Complete wedding day beauty including trial and day-of makeup"
        },
        "price": "480",
        "priceCurrency": "USD"
      }
    ],
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Huda K."
        },
        "datePublished": "2024-10-15",
        "reviewBody": "Absolutely stunning work! My bridal makeup was flawless and lasted all night. The artist really understood my vision.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Huda M."
        },
        "datePublished": "2024-09-20",
        "reviewBody": "The attention to detail is incredible. They made me feel like a celebrity for my event!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5
        }
      }
    ]
  };

  // Professional Service Schema
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${BUSINESS_CONFIG.name.full} - Makeup Artistry`,
    "description": "Professional makeup artistry services for weddings, events, editorial shoots, and special occasions",
    "provider": {
      "@id": `${BUSINESS_CONFIG.website.url}/#organization`
    },
    "serviceType": "Makeup Artistry",
    "areaServed": {
      "@type": "State",
      "name": "Texas",
      "containedInPlace": {
        "@type": "Country",
        "name": "United States"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HDA Studio Glam Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Individual Glam Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Basic Soft Glam",
                "description": "Natural, polished makeup for everyday elegance"
              },
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "90",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Signature Glam",
                "description": "Premium red carpet glamour"
              },
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "180",
                "priceCurrency": "USD"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Premium Packages",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "VIP Experience",
                "description": "Private studio session with signature glam, lash application, and touch-up kit"
              },
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "275",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Bridal Package",
                "description": "Complete wedding day beauty including consultation, trial, and day-of glam"
              },
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "480",
                "priceCurrency": "USD"
              }
            }
          ]
        }
      ]
    }
  };

  // BreadcrumbList for homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BUSINESS_CONFIG.website.url
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default AdvancedSchemas;
