import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Filter } from 'lucide-react';

// Real transformations using actual photos from the collection
const transformations = [
  {
    before: '/IMG_8863.JPG', // Behind the scenes - shows natural starting point
    after: '/IMG_8916.JPG', // Blue evening gown - polished result
    title: 'Evening Glam Transformation',
    description: 'From natural beauty to stunning evening elegance',
    service: 'Standard Glam',
    category: 'Evening Glam',
  },
  {
    before: '/IMG_8865.JPG', // Behind the scenes makeup application
    after: '/IMG_8912.JPG', // Black sequined dramatic look
    title: 'Dramatic Glam Transformation',
    description: 'Bold transformation with full contour and drama',
    service: 'Signature Glam',
    category: 'Editorial',
  },
  {
    before: '/IMG_8869.JPG', // Client with makeup artist
    after: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', // Blue and gold evening look
    title: 'Bridal Party Glam',
    description: 'Sophisticated bridal party perfection',
    service: 'Soft Glam',
    category: 'Bridal',
  },
];

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
];

const TransformationsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Editorial', 'Evening Glam', 'Bridal', 'Behind the Scenes', 'Special Event'];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Makeup Gallery - Before & After Transformations | HDA Studio"
        description="Explore HDA Studio's portfolio of stunning makeup transformations. View before and after photos of our editorial, bridal, and evening glam work. Professional makeup artistry showcased with real client results."
        keywords="makeup gallery, before after makeup, makeup transformation, beauty portfolio, editorial makeup, bridal makeup, evening glam, makeup artist portfolio, professional makeup results, glam transformation, beauty before after"
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
              Transformations <span className="italic">Gallery</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Witness the artistry of makeup transformation. Drag the slider to see 
              the before and after of our stunning work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Interactive
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Before & <span className="italic">After</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {transformations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <BeforeAfterSlider
                  beforeImage={item.before}
                  afterImage={item.after}
                />
                <div className="mt-4">
                  <span className="text-primary text-xs tracking-widest uppercase">
                    {item.service}
                  </span>
                  <h3 className="text-xl font-serif mt-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Our <span className="italic">Work</span>
            </h2>
          </motion.div>

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-square overflow-hidden group cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

      <Footer />
    </main>
  );
};

export default TransformationsGallery;
