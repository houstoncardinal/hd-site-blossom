import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  structuredData?: object;
  pageType?: 'website' | 'article' | 'service' | 'profile';
}

const SEOHead = ({
  title,
  description,
  keywords = 'makeup artist Houston, professional makeup artist Houston TX, luxury makeup studio, bridal makeup artist Houston, glam makeup services, event makeup, soft glam makeup, wedding makeup Houston, Texas makeup artist, beauty studio',
  canonicalUrl,
  ogImage = '/IMG_8915.JPG',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  pageType = 'website',
}: SEOHeadProps) => {
  const siteUrl = BUSINESS_CONFIG.website.url;
  const fullTitle = title.length > 50 
    ? title 
    : `${title} | ${BUSINESS_CONFIG.name.full}`;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Enhanced description with call-to-action
  const enhancedDescription = description.length < 140 
    ? `${description} ⭐ ${BUSINESS_CONFIG.details.rating.value}/5 rating. Book your appointment today!`
    : description;

  return (
    <Helmet>
      {/* Primary Meta Tags - Power optimized */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={enhancedDescription} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook - Enhanced for engagement */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={enhancedDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${BUSINESS_CONFIG.name.full} - Luxury Makeup Artistry`} />
      <meta property="og:site_name" content={BUSINESS_CONFIG.name.full} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter - Optimized for shares */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={enhancedDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={`${BUSINESS_CONFIG.name.full} - Professional Makeup Services`} />
      <meta name="twitter:creator" content="@hdastudio" />
      <meta name="twitter:site" content="@hdastudio" />

      {/* Additional Power SEO Tags */}
      <meta name="author" content={BUSINESS_CONFIG.name.full} />
      <meta name="publisher" content={BUSINESS_CONFIG.name.full} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="theme-color" content="#D4AF37" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.placename" content={BUSINESS_CONFIG.contact.address.city} />
      
      {/* Business specific */}
      <meta name="classification" content="Beauty Services, Makeup Artist, Bridal Makeup" />
      <meta name="category" content="Beauty & Personal Care" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
