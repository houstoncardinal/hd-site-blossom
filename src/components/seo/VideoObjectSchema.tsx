import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface VideoObjectSchemaProps {
  videos: Array<{
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    uploadDate: string;
    duration?: string;
  }>;
}

/**
 * VideoObject Schema for video content
 * Helps videos appear in Google video search results
 */
const VideoObjectSchema = ({ videos }: VideoObjectSchemaProps) => {
  const videoSchemas = videos.map((video, index) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${BUSINESS_CONFIG.website.url}/#video-${index}`,
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": `${BUSINESS_CONFIG.website.url}${video.thumbnailUrl}`,
    "uploadDate": video.uploadDate,
    "duration": video.duration || "PT1M", // ISO 8601 duration format
    "contentUrl": `${BUSINESS_CONFIG.website.url}${video.contentUrl}`,
    "embedUrl": `${BUSINESS_CONFIG.website.url}${video.contentUrl}`,
    "publisher": {
      "@type": "Organization",
      "@id": `${BUSINESS_CONFIG.website.url}/#organization`,
      "name": BUSINESS_CONFIG.name.full,
      "logo": {
        "@type": "ImageObject",
        "url": `${BUSINESS_CONFIG.website.url}/favicon.png`
      }
    },
    "creator": {
      "@type": "Organization",
      "@id": `${BUSINESS_CONFIG.website.url}/#organization`
    }
  }));

  return (
    <Helmet>
      {videoSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default VideoObjectSchema;
