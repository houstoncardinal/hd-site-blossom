import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import VideoObjectSchema from './seo/VideoObjectSchema';

const videoReviews = [
  {
    id: 1,
    videoSrc: '/vid1.mov',
    thumbnail: '/IMG_8915.JPG',
    clientName: 'Real Client Review',
    rating: 5,
    service: 'Makeup Transformation',
    quote: 'Watch this authentic client review and transformation.',
  },
  {
    id: 2,
    videoSrc: '/vid2.mov',
    thumbnail: '/IMG_8960.JPG',
    clientName: 'Real Client Review',
    rating: 5,
    service: 'Glam Experience',
    quote: 'See the full makeup experience and final results.',
  },
];

const VideoReviews = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handlePlayClick = (id: number) => {
    // Pause all other videos
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (video && Number(key) !== id) {
        video.pause();
      }
    });

    // Play the selected video
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setActiveVideo(id);
      } else {
        video.pause();
        setActiveVideo(null);
      }
    }
  };

  return (
    <>
      <VideoObjectSchema
        videos={videoReviews.map((review) => ({
          name: `${review.clientName} - ${review.service}`,
          description: review.quote,
          thumbnailUrl: review.thumbnail,
          contentUrl: review.videoSrc,
          uploadDate: "2024-12-01",
          duration: "PT30S"
        }))}
      />
      <section className="py-24 md:py-32 bg-gradient-hero relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
            Client Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            See What Our <span className="italic text-primary">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
            Real transformations, real reactions. Watch our clients share their experience.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {videoReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              {/* Video Container */}
              <div className="relative aspect-[9/16] md:aspect-video bg-charcoal-light rounded-2xl overflow-hidden shadow-2xl mb-6">
                <video
                  ref={(el) => (videoRefs.current[review.id] = el)}
                  className="w-full h-full object-cover"
                  poster={review.thumbnail}
                  controls
                  preload="metadata"
                  playsInline
                  onPlay={() => setActiveVideo(review.id)}
                  onPause={() => setActiveVideo(null)}
                  onEnded={() => setActiveVideo(null)}
                >
                  <source src={review.videoSrc} type="video/quicktime" />
                  <source src={review.videoSrc.replace('.mov', '.mp4')} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Play Button Overlay */}
                {activeVideo !== review.id && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handlePlayClick(review.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/50 transition-all duration-300"
                    aria-label="Play client video review"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/50"
                    >
                      <Play size={32} className="text-primary-foreground ml-1" fill="currentColor" />
                    </motion.div>
                  </motion.button>
                )}
              </div>

              {/* Review Info */}
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground text-lg font-light italic leading-relaxed">
                  "{review.quote}"
                </p>

                {/* Client Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{review.clientName}</p>
                    <p className="text-sm text-muted-foreground">{review.service}</p>
                  </div>
                  <span className="text-xs tracking-widest uppercase text-primary">
                    Verified Client
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Join hundreds of satisfied clients
          </p>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default VideoReviews;
