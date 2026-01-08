import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageLightbox from '@/components/ImageLightbox';
import { Filter } from 'lucide-react';

const galleryImages = [
  { src: '/IMG_8915.JPG', category: 'Editorial' },
  { src: '/IMG_8910.JPG', category: 'Editorial' },
  { src: '/IMG_8900.JPG', category: 'Evening Glam' },
  { src: '/IMG_8905.JPG', category: 'Editorial' },
  { src: '/IMG_8920.JPG', category: 'Editorial' },
  { src: '/IMG_8960.JPG', category: 'Evening Glam' },
  { src: '/IMG_8955.JPG', category: 'Evening Glam' },
  { src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', category: 'Evening Glam' },
  { src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', category: 'Bridal' },
  { src: '/IMG_8863.JPG', category: 'Behind the Scenes' },
  { src: '/IMG_8865.JPG', category: 'Behind the Scenes' },
  { src: '/IMG_8869.JPG', category: 'Special Event' },
  { src: '/IMG_8901.JPG', category: 'Editorial' },
  { src: '/IMG_8902.JPG', category: 'Evening Glam' },
  { src: '/IMG_8903.JPG', category: 'Editorial' },
  { src: '/IMG_8904.JPG', category: 'Editorial' },
  { src: '/IMG_8909.JPG', category: 'Evening Glam' },
  { src: '/IMG_8911.JPG', category: 'Editorial' },
  { src: '/IMG_8912.JPG', category: 'Evening Glam' },
  { src: '/IMG_8913.JPG', category: 'Editorial' },
  { src: '/IMG_8914.JPG', category: 'Editorial' },
  { src: '/IMG_8916.JPG', category: 'Evening Glam' },
  { src: '/IMG_8918.JPG', category: 'Editorial' },
  { src: '/IMG_8919.JPG', category: 'Evening Glam' },
  { src: '/IMG_8949.JPG', category: 'Editorial' },
  { src: '/IMG_8950.JPG', category: 'Editorial' },
  { src: '/IMG_8951.JPG', category: 'Evening Glam' },
  { src: '/IMG_8952.JPG', category: 'Special Event' },
  { src: '/IMG_8953.JPG', category: 'Editorial' },
  { src: '/IMG_8954.JPG', category: 'Evening Glam' },
  { src: '/IMG_8956.JPG', category: 'Editorial' },
  { src: '/IMG_8957.JPG', category: 'Evening Glam' },
  { src: '/IMG_8958.JPG', category: 'Editorial' },
  { src: '/IMG_8959.JPG', category: 'Evening Glam' },
  { src: '/IMG_8963.JPG', category: 'Editorial' },
  { src: '/IMG_8964.JPG', category: 'Evening Glam' },
  { src: '/IMG_8965.JPG', category: 'Editorial' },
  { src: '/IMG_8966.JPG', category: 'Special Event' },
  { src: '/IMG_8968.JPG', category: 'Editorial' },
  { src: '/IMG_9166.jpg', category: 'Evening Glam' },
  { src: '/IMG_9167.jpg', category: 'Evening Glam' },
  { src: '/image0.jpeg', category: 'Editorial' },
  { src: '/image1.jpeg', category: 'Evening Glam' },
  { src: '/image2.jpeg', category: 'Editorial' },
  { src: '/image3.jpeg', category: 'Evening Glam' },
  { src: '/image4.jpeg', category: 'Editorial' },
  { src: '/image6.jpeg', category: 'Evening Glam' },
  { src: '/image7.jpeg', category: 'Editorial' },
  { src: '/image8.jpeg', category: 'Special Event' },
  { src: '/image9.jpeg', category: 'Evening Glam' },
  { src: '/image10.jpeg', category: 'Editorial' },
  { src: '/image11.jpeg', category: 'Evening Glam' },
  { src: '/image12.jpeg', category: 'Editorial' },
  { src: '/image13.jpeg', category: 'Evening Glam' },
  { src: '/image14.jpeg', category: 'Editorial' },
  { src: '/image15.jpeg', category: 'Evening Glam' },
  { src: '/image16.jpeg', category: 'Editorial' },
  { src: '/image17.jpeg', category: 'Evening Glam' },
  { src: '/image18.jpeg', category: 'Editorial' },
  { src: '/image19.jpeg', category: 'Special Event' },
  { src: '/image20.jpeg', category: 'Evening Glam' },
  { src: '/image21.jpeg', category: 'Editorial' },
  { src: '/image22.jpeg', category: 'Evening Glam' },
  { src: '/image23.jpeg', category: 'Editorial' },
];

const TransformationsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = ['All', 'Editorial', 'Evening Glam', 'Bridal', 'Behind the Scenes', 'Special Event'];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
                className="relative aspect-square overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={`${image.category} makeup look`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-sm tracking-widest uppercase">
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={filteredImages.map(img => ({ src: img.src, alt: `${img.category} makeup look` }))}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))}
      />

      <Footer />
    </main>
  );
};

export default TransformationsGallery;
