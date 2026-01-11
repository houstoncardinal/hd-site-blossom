import { Helmet } from 'react-helmet-async';

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  duration?: string; // ISO 8601 format (e.g., "PT5M30S" for 5 min 30 sec)
  contentUrl?: string;
  embedUrl?: string;
}

/**
 * Video Schema Markup for rich snippets in search results
 * Helps videos appear with thumbnail, duration, and description in search
 */
export const VideoSchema = ({
  name,
  description,
  thumbnailUrl,
  uploadDate = new Date().toISOString(),
  duration = "PT2M",
  contentUrl,
  embedUrl,
}: VideoSchemaProps) => {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
};

interface VideoListSchemaProps {
  videos: Array<{
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate?: string;
    duration?: string;
    contentUrl?: string;
    embedUrl?: string;
  }>;
}

/**
 * Video ItemList Schema for video galleries
 */
export const VideoListSchema = ({ videos }: VideoListSchemaProps) => {
  const videoListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.name,
        "description": video.description,
        "thumbnailUrl": video.thumbnailUrl,
        "uploadDate": video.uploadDate || new Date().toISOString(),
        "duration": video.duration || "PT2M",
        ...(video.contentUrl && { "contentUrl": video.contentUrl }),
        ...(video.embedUrl && { "embedUrl": video.embedUrl }),
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(videoListSchema)}
      </script>
    </Helmet>
  );
};
