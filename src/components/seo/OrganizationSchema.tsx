import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG, getSchemaAddress, getActiveSocialLinks } from '@/config/business';

const OrganizationSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${BUSINESS_CONFIG.website.url}/#organization`,
    "name": BUSINESS_CONFIG.name.full,
    "alternateName": `${BUSINESS_CONFIG.name.full} Beauty Studio`,
    "description": BUSINESS_CONFIG.details.description,
    "url": BUSINESS_CONFIG.website.url,
    "logo": {
      "@type": "ImageObject",
      "url": `${BUSINESS_CONFIG.website.url}${BUSINESS_CONFIG.website.logo.main}`,
      "width": 512,
      "height": 512
    },
    "image": [
      `${BUSINESS_CONFIG.website.url}/IMG_8915.JPG`,
      `${BUSINESS_CONFIG.website.url}/IMG_8910.JPG`,
      `${BUSINESS_CONFIG.website.url}/IMG_8865.JPG`
    ],
    "telephone": BUSINESS_CONFIG.contact.phone.raw,
    "email": BUSINESS_CONFIG.contact.email.primary,
    "address": getSchemaAddress(),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_CONFIG.contact.geo.latitude.toString(),
      "longitude": BUSINESS_CONFIG.contact.geo.longitude.toString()
    },
    "openingHoursSpecification": BUSINESS_CONFIG.hours.schemaFormat,
    "priceRange": BUSINESS_CONFIG.details.priceRange,
    "servesCuisine": null,
    "acceptsReservations": BUSINESS_CONFIG.details.accepts.reservations ? "true" : "false",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": BUSINESS_CONFIG.details.rating.value.toString(),
      "reviewCount": BUSINESS_CONFIG.details.rating.count.toString(),
      "bestRating": BUSINESS_CONFIG.details.rating.maxRating.toString(),
      "worstRating": "1"
    },
    "sameAs": getActiveSocialLinks().map(link => link.url),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HDA Studio Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Basic Soft Glam",
            "description": "Natural, polished makeup look with soft definition. Perfect for work, casual outings, or everyday elegance.",
            "provider": {
              "@id": "https://hdastudio.com/#organization"
            }
          },
          "price": "90",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Soft Glam",
            "description": "Enhanced everyday glam with gentle definition and refined sophistication for any occasion.",
            "provider": {
              "@id": "https://hdastudio.com/#organization"
            }
          },
          "price": "108",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Standard Glam",
            "description": "Balanced, event-ready glam perfect for weddings, parties, and special occasions.",
            "provider": {
              "@id": "https://hdastudio.com/#organization"
            }
          },
          "price": "144",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Signature Glam",
            "description": "Premium show-stopping glamour with intricate artistry for red carpet events and editorials.",
            "provider": {
              "@id": "https://hdastudio.com/#organization"
            }
          },
          "price": "180",
          "priceCurrency": "USD"
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
