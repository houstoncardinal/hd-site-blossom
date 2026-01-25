import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageLightbox from '@/components/ImageLightbox';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { usePublicGallery } from '@/hooks/usePublicGallery';
import { Loader2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Before/After transformation data
const beforeAfterImages = [
  {
    id: 1,
    before: '/before-after-1-before.jpg',
    after: '/before-after-1-after.jpg',
    title: 'Soft Glam Transformation',
  },
  {
    id: 2,
    before: '/before-after-2-before.jpg',
    after: '/before-after-2-after.jpg',
    title: 'Full Glam Look',
  },
  {
    id: 3,
    before: '/before-after-3-before.jpg',
    after: '/before-after-3-after.jpg',
    title: 'Bridal Glam',
  },
];

// Client video reels (Instagram/TikTok embeds or direct video URLs)
const clientVideos = [
  {
    id: 1,
    thumbnail: '/video-thumb-1.jpg',
    videoUrl: 'https://www.instagram.com/reel/example1',
    title: 'Bridal Glam BTS',
  },
  {
    id: 2,
    thumbnail: '/video-thumb-2.jpg',
    videoUrl: 'https://www.instagram.com/reel/example2',
    title: 'Soft Glam Tutorial',
  },
  {
    id: 3,
    thumbnail: '/video-thumb-3.jpg',
    videoUrl: 'https://www.instagram.com/reel/example3',
    title: 'Get Ready With Me',
  },
];

// Before/After Slider Component
const BeforeAfterSlider = ({ before, after, title }: { before: string; after: string; title: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <div className="relative">
      <div
        className="relative aspect-[3/4] overflow-hidden cursor-ew-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <img
          src={after}
          alt={`${title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={before}
            alt={`${title} - Before`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <ChevronLeft size={14} className="text-primary-foreground" />
            <ChevronRight size={14} className="text-primary-foreground" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 uppercase tracking-wider">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 uppercase tracking-wider">
          After
        </div>
      </div>
      <p className="text-center mt-3 text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

const TransformationsGallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { images: galleryImages, loading, error } = usePublicGallery();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Transformations Gallery | HDA Studio"
        description="See stunning before & after transformations by HDA Studio. Browse our portfolio of makeup artistry, client videos, and real results from soft glam to full glam looks."
        keywords="makeup transformations, before and after makeup, makeup portfolio, glam makeup, beauty transformations, makeup artist work, client results"
        canonicalUrl="/gallery"
        ogImage="/IMG_8915.JPG"
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Transformations', url: '/gallery' }
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Transformations', url: '/gallery' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Our Work
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              <span className="italic">Transformations</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Real results from real clients. See the magic of professional glam artistry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">
              Before & After
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light">
              See the <span className="italic">Difference</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Drag the slider to reveal the transformation. Each look is customized to enhance natural beauty.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {beforeAfterImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BeforeAfterSlider
                  before={item.before}
                  after={item.after}
                  title={item.title}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Videos/Reels Section */}
      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">
              Client Videos
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light">
              Reels & <span className="italic">Highlights</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Watch our clients' transformations come to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {clientVideos.map((video, index) => (
              <motion.a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[9/16] bg-muted overflow-hidden"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium">{video.title}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light">
              More <span className="italic">Looks</span>
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading gallery...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Failed to load gallery images. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm tracking-widest uppercase">View</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={galleryImages.map(img => ({ src: img.src, alt: img.alt }))}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
      />

      <Footer />
    </main>
  );
};

export default TransformationsGallery;
