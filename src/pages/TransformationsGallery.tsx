import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import before1 from '@/assets/before-1.jpg';
import after1 from '@/assets/after-1.jpg';
import before2 from '@/assets/before-2.jpg';
import after2 from '@/assets/after-2.jpg';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';

const transformations = [
  {
    before: before1,
    after: after1,
    title: 'Soft Glam Transformation',
    description: 'Natural beauty enhanced with soft, radiant makeup',
    service: 'Soft Glam',
  },
  {
    before: before2,
    after: after2,
    title: 'Bridal Beauty',
    description: 'Timeless elegance for a perfect wedding day',
    service: 'Bridal',
  },
];

const galleryImages = [
  { src: softGlamImage, category: 'Soft Glam' },
  { src: bridalImage, category: 'Bridal' },
  { src: glamImage, category: 'Evening Glam' },
  { src: naturalImage, category: 'Natural Glow' },
  { src: softGlamImage, category: 'Soft Glam' },
  { src: bridalImage, category: 'Bridal' },
];

const TransformationsGallery = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
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
            className="text-center mb-16"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Our <span className="italic">Work</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
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
