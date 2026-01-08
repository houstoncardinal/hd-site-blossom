import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface Service {
  id: string;
  title: string;
  description: string;
  seoDescription: string;
  price: number;
  duration: string;
  keywords: string;
}

interface ServiceSchemaProps {
  services: Service[];
}

const ServiceSchema = ({ services }: ServiceSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "HDA Studio",
    "description": "Luxury beauty services and professional makeup artistry in an elegant, intimate setting",
    "url": "https://hdastudio.com",
    "image": "https://hdastudio.com/IMG_8900.JPG",
    "priceRange": "$75-$400",
    "telephone": "+1-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "City",
      "addressRegion": "State",
      "addressCountry": "US"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HDA Studio Glam Services",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.seoDescription,
          "provider": {
            "@type": "BeautySalon",
            "name": "HDA Studio"
          }
        },
        "price": service.price.toString(),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "position": index + 1
      }))
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HDA Studio",
    "description": "Professional makeup artistry and beauty services",
    "url": "https://hdastudio.com",
    "logo": "https://hdastudio.com/logo.png",
    "sameAs": [
      BUSINESS_CONFIG.social.instagram.url
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;
