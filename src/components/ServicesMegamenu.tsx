import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Star, ChevronRight } from 'lucide-react';

interface ServicesMegamenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// The five core services (matching Services page)
const services = [
  {
    id: 'basic-soft-glam',
    title: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition',
    price: '$100',
    originalPrice: '$125',
    duration: '45 min',
    image: '/IMG_8863.JPG',
    icon: Sparkles,
    popular: false,
  },
  {
    id: 'full-glam',
    title: 'Full Glam',
    description: 'Event-ready glam for special occasions',
    price: '$150',
    originalPrice: '$175',
    duration: '75 min',
    image: '/IMG_8916.JPG',
    icon: Star,
    popular: true,
  },
  {
    id: 'signature-glam',
    title: 'Signature Glam',
    description: 'Premium show-stopping glamour',
    price: '$216',
    originalPrice: '$246',
    duration: '90 min',
    image: '/signature-glam.jpeg',
    icon: Crown,
    popular: false,
  },
  {
    id: 'hair-makeup-combo',
    title: 'Hair + Makeup Combo',
    description: 'Complete transformation package',
    price: '$245',
    originalPrice: '$320',
    duration: '2+ hours',
    image: '/IMG_8955.JPG',
    icon: Crown,
    popular: false,
  },
  {
    id: 'bridal-complete',
    title: 'Bridal Package',
    description: 'Complete bridal hair, makeup & trial',
    price: '$480',
    originalPrice: '$635',
    duration: 'Multiple',
    image: '/IMG_8900.JPG',
    icon: Crown,
    popular: false,
  },
];

const addOns = [
  { name: 'Airbrush Makeup Upgrade', price: '$35' },
  { name: 'Formal Updo', price: '$120' },
  { name: 'Blowout Styling', price: '$75' },
  { name: 'On-Location (0-15 mi)', price: '$35' },
  { name: 'Touch-Up Kit', price: '$25' },
];

// Removed bundles - only showing core services and add-ons

const ServicesMegamenu = ({ isOpen, onClose }: ServicesMegamenuProps) => {
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        when: 'afterChildren',
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Megamenu Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute left-0 right-0 top-full mt-0 bg-card border-y border-border shadow-2xl z-50 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Main Services Section - 7 columns */}
                <div className="lg:col-span-7">
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-primary mb-6 font-sans">
                      Our Services
                    </h3>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <motion.div
                          key={service.id}
                          variants={itemVariants}
                        >
                          <Link
                            to="/services"
                            onClick={onClose}
                            className="group block relative overflow-hidden rounded-lg border border-border hover:border-primary transition-all duration-300 bg-background/50 hover:bg-background"
                          >
                            {/* Popular Badge */}
                            {service.popular && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                  <Star size={12} fill="currentColor" />
                                  Popular
                                </span>
                              </div>
                            )}

                            {/* Image */}
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Icon size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                  <h4 className="font-serif text-base leading-tight">
                                    {service.title}
                                  </h4>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                  <span className="text-xs text-muted-foreground line-through mr-1">
                                    {service.originalPrice}
                                  </span>
                                  <span className="text-primary font-semibold text-sm">
                                    {service.price}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {service.description}
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs text-muted-foreground">
                                  {service.duration}
                                </span>
                                <ChevronRight
                                  size={14}
                                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                                />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar - 5 columns */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Add-Ons Section */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-sans">
                      Add-Ons
                    </h3>
                    <div className="bg-background/50 rounded-lg border border-border p-5 space-y-3">
                      {addOns.map((addOn, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0 last:pb-0"
                        >
                          <span className="text-foreground">{addOn.name}</span>
                          <span className="text-primary font-medium">{addOn.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Section */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 text-center">
                      <Sparkles className="mx-auto mb-3 text-primary" size={24} />
                      <h4 className="font-serif text-lg mb-2">Not Sure Which Service?</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Explore our services to find the perfect glam experience
                      </p>
                      <Link
                        to="/services"
                        onClick={onClose}
                        className="inline-block w-full bg-primary text-primary-foreground text-sm tracking-widest uppercase px-6 py-3 rounded hover:bg-primary/90 transition-colors duration-300"
                      >
                        View All Services
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Link */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-6 border-t border-border text-center"
              >
                <Link
                  to="/services"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  View Full Service Menu
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServicesMegamenu;
