import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

export const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  article,
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://hdastudio.com';
  const businessName = import.meta.env.VITE_BUSINESS_NAME || 'HDA Studio';

  // Default values
  const defaultTitle = `${businessName} - Professional Makeup Artist in Los Angeles`;
  const defaultDescription =
    'Award-winning makeup artist specializing in bridal, editorial, and special event makeup. Transform your look with our expert beauty services in Los Angeles.';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  const defaultKeywords = [
    'makeup artist',
    'bridal makeup',
    'wedding makeup',
    'los angeles makeup artist',
    'professional makeup',
    'special event makeup',
    'editorial makeup',
    'beauty services',
    'makeup studio',
    'prom makeup',
    'quinceañera makeup',
  ];

  const seoTitle = title ? `${title} | ${businessName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;
  const seoKeywords = keywords.length > 0 ? keywords : defaultKeywords;
  const canonicalUrl = canonical || seoUrl;

  // Robots meta tag
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={businessName} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific OG tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags &&
            article.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:creator" content="@hdastudio" />
      <meta name="twitter:site" content="@hdastudio" />

      {/* Additional Meta Tags */}
      <meta name="author" content={businessName} />
      <meta name="publisher" content={businessName} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${businessName}`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={businessName} />

      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Favicon Links */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Geo Tags */}
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.placename" content="Los Angeles" />
      <meta name="geo.position" content="34.0522;-118.2437" />
      <meta name="ICBM" content="34.0522, -118.2437" />

      {/* Alternate Links */}
      <link rel="alternate" href={seoUrl} hrefLang="en-US" />
      <link rel="alternate" href={seoUrl} hrefLang="x-default" />
    </Helmet>
  );
};
