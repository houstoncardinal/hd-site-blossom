import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageLightbox from './ImageLightbox';

const galleryImages = [
  { src: '/IMG_8915.JPG', alt: 'Evening Glam Runway Look', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8863.JPG', alt: 'Behind the Scenes Makeup Session', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8910.JPG', alt: 'Editorial Fashion Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8960.JPG', alt: 'High Fashion Editorial Look', span: 'col-span-1 row-span-2' },
  { src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', alt: 'Elegant Evening Glam', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8900.JPG', alt: 'Global Fashion Week Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8920.JPG', alt: 'Bold Editorial Makeup', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8865.JPG', alt: 'Professional Makeup Application', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8905.JPG', alt: 'Dramatic Runway Look', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8955.JPG', alt: 'Evening Glam Dark Tones', span: 'col-span-1 row-span-2' },
  { src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', alt: 'Bridal Party Glam', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8869.JPG', alt: 'Special Event Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image0.jpeg', alt: 'Glamorous Evening Look', span: 'col-span-1 row-span-2' },
  { src: '/image1.jpeg', alt: 'Natural Beauty Enhancement', span: 'col-span-1 row-span-1' },
  { src: '/image2.jpeg', alt: 'Bridal Makeup Artistry', span: 'col-span-1 row-span-1' },
  { src: '/image3.jpeg', alt: 'Editorial Fashion Statement', span: 'col-span-1 row-span-2' },
  { src: '/image4.jpeg', alt: 'Elegant Event Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8949.JPG', alt: 'Sophisticated Glam Look', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8950.JPG', alt: 'Bold Beauty Transformation', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8951.JPG', alt: 'Radiant Bridal Beauty', span: 'col-span-1 row-span-1' },
  { src: '/image6.jpeg', alt: 'Classic Glamour Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image7.jpeg', alt: 'Stunning Evening Elegance', span: 'col-span-1 row-span-2' },
  { src: '/image8.jpeg', alt: 'Professional Beauty Artistry', span: 'col-span-1 row-span-1' },
  { src: '/image9.jpeg', alt: 'Dramatic Eye Makeup', span: 'col-span-1 row-span-1' },
  { src: '/IMG_9166.jpg', alt: 'Modern Glam Transformation', span: 'col-span-1 row-span-1' },
  { src: '/IMG_9167.jpg', alt: 'Timeless Beauty Look', span: 'col-span-1 row-span-2' },
  { src: '/image10.jpeg', alt: 'Flawless Complexion Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image11.jpeg', alt: 'Sophisticated Event Look', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8952.JPG', alt: 'Luxury Beauty Experience', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8953.JPG', alt: 'Editorial Glam Artistry', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8954.JPG', alt: 'Polished Evening Beauty', span: 'col-span-1 row-span-1' },
  { src: '/image12.jpeg', alt: 'Radiant Bridal Glow', span: 'col-span-1 row-span-2' },
  { src: '/image13.jpeg', alt: 'Contemporary Glam Style', span: 'col-span-1 row-span-1' },
  { src: '/image14.jpeg', alt: 'Elegant Makeup Design', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8956.JPG', alt: 'Artistic Beauty Creation', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8957.JPG', alt: 'Glamorous Party Look', span: 'col-span-1 row-span-2' },
  { src: '/image15.jpeg', alt: 'Flawless Skin Perfection', span: 'col-span-1 row-span-1' },
  { src: '/image16.jpeg', alt: 'Bold Editorial Statement', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8958.JPG', alt: 'Refined Beauty Transformation', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8959.JPG', alt: 'Chic Modern Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image17.jpeg', alt: 'Luxurious Glam Look', span: 'col-span-1 row-span-1' },
  { src: '/image18.jpeg', alt: 'Sophisticated Beauty Style', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8963.JPG', alt: 'Professional Makeup Excellence', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8964.JPG', alt: 'Stunning Transformation', span: 'col-span-1 row-span-1' },
  { src: '/image19.jpeg', alt: 'Elegant Evening Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image20.jpeg', alt: 'Radiant Beauty Look', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8965.JPG', alt: 'Artistic Glam Creation', span: 'col-span-1 row-span-1' },
  { src: '/IMG_8966.JPG', alt: 'Polished Event Beauty', span: 'col-span-1 row-span-1' },
  { src: '/image21.jpeg', alt: 'Classic Elegance Makeup', span: 'col-span-1 row-span-1' },
  { src: '/image22.jpeg', alt: 'Modern Beauty Artistry', span: 'col-span-1 row-span-2' },
  { src: '/IMG_8968.JPG', alt: 'Luxe Makeup Design', span: 'col-span-1 row-span-1' },
  { src: '/image23.jpeg', alt: 'Flawless Glam Finish', span: 'col-span-1 row-span-1' },
];

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden group cursor-pointer ${image.span}`}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
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

      <ImageLightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </section>
  );
};

export default Gallery;
