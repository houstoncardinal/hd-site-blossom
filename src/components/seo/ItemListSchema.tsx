import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface ItemListSchemaProps {
  name: string;
  description: string;
  items: Array<{
    name: string;
    url?: string;
    image?: string;
    description?: string;
  }>;
}

/**
 * ItemList Schema for collections (services, gallery, etc)
 * Helps Google understand lists and collections on your site
 */
const ItemListSchema = ({ name, description, items }: ItemListSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": item.url || BUSINESS_CONFIG.website.url,
      ...(item.image && {
        "image": {
          "@type": "ImageObject",
          "url": `${BUSINESS_CONFIG.website.url}${item.image}`,
          "caption": item.name
        }
      }),
      ...(item.description && { "description": item.description })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ItemListSchema;
