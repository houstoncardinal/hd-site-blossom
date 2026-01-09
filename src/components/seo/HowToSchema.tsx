import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}

/**
 * HowTo Schema for process/instruction pages
 * Helps content appear in Google's "How To" rich results
 */
const HowToSchema = ({ name, description, totalTime, estimatedCost, steps }: HowToSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }), // ISO 8601 duration format
    ...(estimatedCost && {
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": estimatedCost.currency,
        "value": estimatedCost.value
      }
    }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": {
          "@type": "ImageObject",
          "url": `${BUSINESS_CONFIG.website.url}${step.image}`
        }
      })
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

export default HowToSchema;
