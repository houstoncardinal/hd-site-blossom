/**
 * Image Gallery Schema
 * Structured data for image galleries
 * Helps Google understand and display image content in rich results
 */

import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface ImageItem {
  url: string;
  caption: string;
  category?: string;
}

interface ImageGallerySchemaProps {
  images: ImageItem[];
  title: string;
  description: string;
}

const ImageGallerySchema = ({ images, title, description }: ImageGallerySchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    description: description,
    url: `${BUSINESS_CONFIG.website.url}/gallery`,
    creator: {
      '@type': 'Organization',
      name: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.website.url,
    },
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: `${BUSINESS_CONFIG.website.url}${img.url}`,
      caption: img.caption,
      contentUrl: `${BUSINESS_CONFIG.website.url}${img.url}`,
      creator: {
        '@type': 'Organization',
        name: BUSINESS_CONFIG.name,
      },
      ...(img.category && {
        keywords: img.category,
      }),
    })),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: images.length,
      itemListElement: images.map((img, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'ImageObject',
          url: `${BUSINESS_CONFIG.website.url}${img.url}`,
          name: img.caption,
        },
      })),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ImageGallerySchema;
