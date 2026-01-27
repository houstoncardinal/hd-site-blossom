import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition. Perfect for work, casual outings, or everyday elegance.',
    price: '$120',
    image: '/basic-softglam-cover.jpeg',
    duration: '45 min',
  },
  {
    title: 'Soft Glam',
    description: 'Enhanced everyday glam with gentle definition and refined sophistication for any occasion.',
    price: '$150',
    image: '/soft-glam-2.jpeg',
    duration: '60 min',
  },
  {
    title: 'Full Glam',
    description: 'Balanced, event-ready glam perfect for weddings, parties, and special occasions.',
    price: '$180',
    image: '/full-glam-cover.jpeg',
    duration: '75 min',
  },
  {
    title: 'Hair + Makeup Combo',
    description: 'Complete transformation with professional hair styling and makeup artistry.',
    price: 'From $300',
    image: '/full-glam-2.jpeg',
    duration: '2 hours',
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
              <Link to="/services">
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
                      Learn More
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
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Services Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-block text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 border-b border-muted-foreground hover:border-primary pb-1"
          >
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
