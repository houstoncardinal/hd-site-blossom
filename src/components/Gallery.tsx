import { motion } from 'framer-motion';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';

const galleryImages = [
  { src: softGlamImage, alt: 'Soft Glam Makeup Look', span: 'col-span-1 row-span-2' },
  { src: bridalImage, alt: 'Bridal Beauty', span: 'col-span-1 row-span-1' },
  { src: glamImage, alt: 'Evening Glam', span: 'col-span-1 row-span-1' },
  { src: naturalImage, alt: 'Natural Glow', span: 'col-span-1 row-span-2' },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-charcoal-light">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Beauty <span className="italic">Gallery</span>
          </h2>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden group cursor-pointer ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-sm tracking-widest uppercase text-foreground">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
