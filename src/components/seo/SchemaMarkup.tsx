import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  type:
    | 'LocalBusiness'
    | 'BeautySalon'
    | 'Service'
    | 'Review'
    | 'FAQPage'
    | 'BreadcrumbList'
    | 'ImageGallery'
    | 'Person';
  data: any;
}

export const SchemaMarkup = ({ type, data }: SchemaMarkupProps) => {
  const generateSchema = () => {
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://hdastudio.com';

    switch (type) {
      case 'LocalBusiness':
      case 'BeautySalon':
        return {
          '@context': 'https://schema.org',
          '@type': 'BeautySalon',
          '@id': `${baseUrl}/#organization`,
          name: data.name || 'HDA Studio',
          alternateName: 'HD Artistry Studio',
          description:
            data.description ||
            'Professional makeup artist and beauty services in Los Angeles. Specializing in bridal, editorial, and special event makeup with over 10 years of experience.',
          url: baseUrl,
          telephone: data.phone || '+1-XXX-XXX-XXXX',
          email: data.email || 'info@hdastudio.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || '123 Beauty Lane',
            addressLocality: data.address?.city || 'Los Angeles',
            addressRegion: data.address?.state || 'CA',
            postalCode: data.address?.zip || '90001',
            addressCountry: 'US',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || '34.0522',
            longitude: data.geo?.longitude || '-118.2437',
          },
          openingHoursSpecification: data.hours || [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '16:00',
            },
          ],
          priceRange: '$$',
          image: data.image || `${baseUrl}/og-image.jpg`,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: '600',
            height: '60',
          },
          sameAs: data.socialMedia || [
            'https://www.instagram.com/hdastudio',
            'https://www.facebook.com/hdastudio',
            'https://www.tiktok.com/@hdastudio',
          ],
          aggregateRating: data.rating
            ? {
                '@type': 'AggregateRating',
                ratingValue: data.rating.value || '4.9',
                reviewCount: data.rating.count || '150',
                bestRating: '5',
                worstRating: '1',
              }
            : undefined,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Beauty Services',
            itemListElement: data.services || [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Bridal Makeup',
                  description: 'Professional bridal makeup services for your special day',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Special Event Makeup',
                  description: 'Makeup services for proms, quinceañeras, and special occasions',
                },
              },
            ],
          },
          paymentAccepted: 'Cash, Credit Card, Debit Card, Venmo, Zelle',
          currenciesAccepted: 'USD',
        };

      case 'Service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: data.serviceType || 'Beauty Services',
          name: data.name,
          description: data.description,
          provider: {
            '@type': 'BeautySalon',
            name: 'HDA Studio',
            url: baseUrl,
          },
          areaServed: {
            '@type': 'City',
            name: data.areaServed || 'Los Angeles',
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/services/${data.slug}`,
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toISOString()
              .split('T')[0],
          },
          image: data.image || `${baseUrl}/services/${data.slug}.jpg`,
          aggregateRating: data.rating
            ? {
                '@type': 'AggregateRating',
                ratingValue: data.rating.value,
                reviewCount: data.rating.count,
              }
            : undefined,
        };

      case 'Review':
        return {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'BeautySalon',
            name: 'HDA Studio',
          },
          author: {
            '@type': 'Person',
            name: data.authorName,
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: '5',
            worstRating: '1',
          },
          reviewBody: data.text,
          datePublished: data.date,
        };

      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.questions.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })),
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          })),
        };

      case 'ImageGallery':
        return {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: data.name || 'HDA Studio Gallery',
          description: data.description || 'Portfolio of our makeup artistry work',
          image: data.images.map((img: any) => ({
            '@type': 'ImageObject',
            url: img.url,
            caption: img.caption,
            thumbnailUrl: img.thumbnail,
            contentUrl: img.url,
          })),
        };

      case 'Person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: data.name,
          jobTitle: data.jobTitle || 'Professional Makeup Artist',
          description: data.description,
          image: data.image,
          worksFor: {
            '@type': 'BeautySalon',
            name: 'HDA Studio',
          },
          sameAs: data.socialMedia || [],
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
