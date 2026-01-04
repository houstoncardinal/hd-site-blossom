import { motion } from 'framer-motion';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';

const services = [
  {
    title: 'Soft Glam',
    description: 'Enhance your natural beauty with a subtle, radiant glow perfect for everyday elegance.',
    price: '$100',
    image: softGlamImage,
    duration: '60 min',
  },
  {
    title: 'Bridal Beauty',
    description: 'Timeless, romantic looks designed to make you feel unforgettable on your special day.',
    price: '$250',
    image: bridalImage,
    duration: '120 min',
  },
  {
    title: 'Evening Glam',
    description: 'Bold, dramatic makeup for galas, events, and nights when you want to make a statement.',
    price: '$150',
    image: glamImage,
    duration: '90 min',
  },
  {
    title: 'Natural Glow',
    description: 'Fresh, dewy looks that celebrate your natural beauty with minimal, refined touches.',
    price: '$80',
    image: naturalImage,
    duration: '45 min',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Featured <span className="italic">Services</span>
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block bg-primary text-primary-foreground text-xs tracking-widest uppercase px-4 py-2">
                    Book Now
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif">{service.title}</h3>
                  <span className="text-primary font-sans text-lg">{service.price}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
                <span className="text-xs text-muted-foreground tracking-wider uppercase">
                  {service.duration}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
