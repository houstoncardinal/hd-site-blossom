import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageLightbox from '@/components/ImageLightbox';
import ImageGallerySchema from '@/components/seo/ImageGallerySchema';
import ItemListSchema from '@/components/seo/ItemListSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { usePublicGallery, type PublicGalleryImage } from '@/hooks/usePublicGallery';
import { Filter, Loader2, Star, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TransformationsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'featured'>('newest');

  const { images: galleryImages, loading, error } = usePublicGallery();

  const categories = ['All', 'Editorial', 'Evening Glam', 'Bridal', 'Behind the Scenes', 'Special Event'];

  const filteredAndSortedImages = useMemo(() => {
    let filtered = selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter(img => img.category === selectedCategory);

    // Sort images
    switch (sortBy) {
      case 'newest':
        // For now, keep original order (assuming they're ordered by creation date)
        break;
      case 'oldest':
        filtered = [...filtered].reverse();
        break;
      case 'featured':
        filtered = [...filtered].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [galleryImages, selectedCategory, sortBy]);

  const featuredImages = galleryImages.filter(img => img.is_featured).slice(0, 6);
  const totalImages = galleryImages.length;
  const categoryStats = categories.slice(1).map(cat => ({
    name: cat,
    count: galleryImages.filter(img => img.category === cat).length
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Makeup Gallery | HDA Studio"
        description="Explore HDA Studio's portfolio of stunning makeup artistry. View our editorial, bridal, and evening glam work. Professional makeup showcased with real client results."
        keywords="makeup gallery, beauty portfolio, editorial makeup, bridal makeup, evening glam, makeup artist portfolio, professional makeup, glam makeup, beauty"
        canonicalUrl="/gallery"
        ogImage="/IMG_8915.JPG"
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Gallery', url: '/gallery' }
        ]}
      />

      <ImageGallerySchema
        title="HDA Studio Makeup Gallery"
        description="Collection of professional makeup artistry showcasing editorial, bridal, evening glam, and special event looks"
        images={galleryImages.map(img => ({
          url: img.src,
          caption: `${img.category} makeup look`,
          category: img.category
        }))}
      />

      <ItemListSchema
        name="HDA Studio Makeup Gallery"
        description="Collection of professional makeup artistry showcasing editorial, bridal, evening glam, and special event looks"
        items={galleryImages.map(img => ({
          name: `${img.category} Makeup Look`,
          image: img.src,
          description: `Professional ${img.category.toLowerCase()} makeup by HDA Studio Houston`
        }))}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Gallery', url: '/gallery' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              <span className="italic">Gallery</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Browse our collection of stunning makeup artistry and transformations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Filter size={16} />
              <span>Filter:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-background border border-border hover:border-primary/50'
                  }
                `}
              >
                {category}
              </button>
            ))}
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
              {filteredAndSortedImages.map((image, index) => (
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
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-sm tracking-widest uppercase">
                      {image.category}
                    </span>
                  </div>
                  {image.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={filteredAndSortedImages.map(img => ({ src: img.src, alt: img.alt }))}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredAndSortedImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < filteredAndSortedImages.length - 1 ? prev + 1 : 0))}
      />

      <Footer />
    </main>
  );
};

export default TransformationsGallery;