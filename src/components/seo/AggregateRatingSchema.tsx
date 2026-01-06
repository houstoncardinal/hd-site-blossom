/**
 * Aggregate Rating Schema
 * Structured data for aggregate ratings and reviews
 * Displays star ratings in Google search results
 */

import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface AggregateRatingSchemaProps {
  ratingValue: number; // Average rating (e.g., 4.8)
  reviewCount: number; // Total number of reviews
  bestRating?: number; // Maximum possible rating (default: 5)
  worstRating?: number; // Minimum possible rating (default: 1)
}

const AggregateRatingSchema = ({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: AggregateRatingSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_CONFIG.website.url}/#organization`,
    name: BUSINESS_CONFIG.name.full,
    image: `${BUSINESS_CONFIG.website.url}${BUSINESS_CONFIG.website.logo.main}`,
    url: BUSINESS_CONFIG.website.url,
    telephone: BUSINESS_CONFIG.contact.phone.raw,
    email: BUSINESS_CONFIG.contact.email.primary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.contact.address.street,
      addressLocality: BUSINESS_CONFIG.contact.address.city,
      addressRegion: BUSINESS_CONFIG.contact.address.state,
      postalCode: BUSINESS_CONFIG.contact.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_CONFIG.contact.geo.latitude,
      longitude: BUSINESS_CONFIG.contact.geo.longitude,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: bestRating,
      worstRating: worstRating,
    },
    priceRange: BUSINESS_CONFIG.details.priceRange,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default AggregateRatingSchema;
