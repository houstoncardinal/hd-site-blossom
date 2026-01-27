import { motion } from 'framer-motion';
import { Clock, Sparkles, Crown, Star, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { formatCurrency } from '@/config/services';

// The five core services
const CORE_SERVICES = [
  {
    id: 'basic-soft-glam',
    name: 'Basic Soft Glam',
    description: 'Natural, polished look with soft definition. Perfect for work, casual outings, or everyday elegance.',
    price: 100,
    originalPrice: 125,
    deposit: 50,
    duration: '45 min',
    image: '/IMG_8863.JPG',
    category: 'makeup',
    icon: Sparkles,
    includes: [
      'Professional skin preparation',
      'Full coverage base application',
      'Soft blush for natural flush',
      'Expert brow grooming & shaping',
      'Subtle eye makeup enhancement',
      'Complimentary lash application',
      'Coordinating lip color',
      'Long-lasting setting spray',
    ],
  },
  {
    id: 'full-glam',
    name: 'Full Glam',
    description: 'Balanced, event-ready glam perfect for weddings, parties, and special occasions.',
    price: 150,
    originalPrice: 175,
    deposit: 75,
    duration: '75 min',
    image: '/IMG_8916.JPG',
    category: 'makeup',
    icon: Star,
    popular: true,
    includes: [
      'Flawless full coverage base',
      'Professional contour & blush sculpting',
      'Strategic highlighter placement',
      'Defined eye look with dimension',
      'Premium complimentary lash application',
      'Expert lip color coordination',
      'Camera-ready finishing touches',
      'Long-wear formula setting',
    ],
  },
  {
    id: 'hair-makeup-combo',
    name: 'Hair + Makeup Combo',
    description: 'Complete transformation package with professional makeup and stunning hair styling.',
    price: 245,
    originalPrice: 320,
    deposit: 122,
    duration: '2+ hours',
    image: '/IMG_8955.JPG',
    category: 'combo',
    icon: Crown,
    includes: [
      'Full glam makeup application',
      'Professional hair styling',
      'Complimentary lash application',
      'Camera-ready finishing',
      'Long-lasting setting spray',
      'Touch-up tips included',
    ],
  },
  {
    id: 'bridal-complete',
    name: 'Bridal Package',
    description: 'Complete bridal hair, makeup & trial. Make your wedding day unforgettable.',
    price: 480,
    originalPrice: 635,
    deposit: 240,
    duration: 'Multiple sessions',
    image: '/IMG_8900.JPG',
    category: 'bridal',
    icon: Heart,
    includes: [
      'Bridal trial session',
      'Wedding day makeup',
      'Wedding day hair styling',
      'Complimentary lash application',
      'Touch-up kit provided',
      'On-location available',
    ],
  },
  {
    id: 'signature-glam',
    name: 'Signature Glam',
    description: 'Premium show-stopping glamour with intricate artistry for red carpet events and editorials.',
    price: 216,
    originalPrice: 246,
    deposit: 108,
    duration: '90 min',
    image: '/signature-glam.jpeg',
    category: 'makeup',
    icon: Crown,
    includes: [
      'High-coverage flawless base',
      'Full facial contouring & sculpting',
      'Enhanced eye makeup artistry',
      'Glitter or cut crease eye design',
      'Precision highlighter balance',
      'Premium complimentary lash application',
      'Statement lip color application',
      'Professional photo-ready finishing',
      'Touch-up kit included',
    ],
  },
];

// Add-ons
const ADDONS = [
  { name: 'Airbrush Makeup Upgrade', price: 35, description: 'Premium airbrush application for flawless finish' },
  { name: 'Formal Updo', price: 120, description: 'Elegant updo for formal occasions' },
  { name: 'Blowout Styling', price: 75, description: 'Professional blowout with smooth finish' },
  { name: 'On-Location (0-15 mi)', price: 35, description: 'Travel within 15 miles of studio' },
  { name: 'On-Location (15-30 mi)', price: 60, description: 'Travel 15-30 miles from studio' },
  { name: 'Touch-Up Kit', price: 25, description: 'Essentials for day-long touch-ups' },
  { name: 'Individual Lashes', price: 15, description: 'Natural individual lash accents' },
  { name: 'Strip Lashes (Premium)', price: 25, description: 'Premium full strip lashes' },
];

const ServiceCard = ({ service, index }: { service: typeof CORE_SERVICES[0]; index: number }) => {
  const savings = service.originalPrice - service.price;
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-card border border-border hover:border-primary/30 transition-all duration-500 rounded-lg overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {service.popular && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase px-3 py-1 flex items-center gap-1 rounded">
            <Star size={12} fill="currentColor" />
            Most Popular
          </div>
        )}
        {savings > 50 && (
          <div className="absolute top-4 left-4 bg-green-600 text-white text-xs tracking-widest uppercase px-3 py-1 rounded">
            Save {formatCurrency(savings)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-primary" />
            <div>
              <p className="text-primary text-xs tracking-widest uppercase mb-1">
                {service.category === 'makeup' && 'Makeup Service'}
                {service.category === 'combo' && 'Hair + Makeup'}
                {service.category === 'bridal' && 'Bridal'}
              </p>
              <h3 className="text-2xl font-serif">{service.name}</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground line-through">
            {formatCurrency(service.originalPrice)}
          </span>
          <span className="text-2xl font-serif text-primary">
            {formatCurrency(service.price)}
          </span>
          {savings > 0 && (
            <span className="text-xs text-green-500 font-medium">
              Save {formatCurrency(savings)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <Clock size={14} />
          {service.duration}
        </div>

        <Link to="/booking">
          <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Book Now • {formatCurrency(service.deposit)} deposit
          </Button>
        </Link>
      </div>
    </motion.article>
  );
};

const ServicesCatalog = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Hair & Makeup Services - Professional Beauty Artist Houston TX"
        description="Professional makeup and hair styling services in Houston. Basic Soft Glam from $100, Full Glam $150, Bridal packages from $480. Book your appointment today!"
        keywords="makeup artist Houston, hair stylist Houston, bridal makeup, wedding makeup, soft glam makeup, full glam makeup, event makeup Houston"
        canonicalUrl="/services"
        ogImage="/IMG_8900.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Services', url: '/services' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Professional Beauty Services
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Our <span className="italic">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              From natural everyday beauty to show-stopping glamour. Choose from our signature
              services designed to make you look and feel your absolute best.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">5</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Core Services</p>
              </div>
              <div className="text-center">
                <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">{ADDONS.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Add-Ons</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">315+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">5-Star Reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Our <span className="italic">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated selection of professional makeup and hair services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_SERVICES.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Enhance Your Look
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Add-On <span className="italic">Services</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Customize your service with premium enhancements. Available with any booking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {ADDONS.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground">{addon.name}</h3>
                  <span className="text-primary font-semibold whitespace-nowrap ml-2">
                    {formatCurrency(addon.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Ready to Book?
            </h2>
            <p className="text-muted-foreground mb-8">
              Choose your service and schedule your appointment today.
              A 50% deposit secures your booking.
            </p>
            <Link to="/booking">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg tracking-widest uppercase">
                Book Your Appointment
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ServicesCatalog;