import { motion } from 'framer-motion';
import { Check, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';
import specialEventImage from '@/assets/service-special-event.jpg';
import editorialImage from '@/assets/service-editorial.jpg';

const services = [
  {
    id: 'soft-glam',
    title: 'Soft Glam',
    tagline: 'Effortless Elegance',
    description: 'Enhance your natural beauty with a subtle, radiant glow. Perfect for everyday elegance, date nights, or any occasion where you want to look polished and refined.',
    price: 100,
    duration: '60 min',
    image: softGlamImage,
    includes: [
      'Skin prep & primer',
      'Natural contouring',
      'Soft eyeshadow blend',
      'Lash application',
      'Natural lip color',
      'Setting spray',
    ],
  },
  {
    id: 'bridal-beauty',
    title: 'Bridal Beauty',
    tagline: 'Your Perfect Day',
    description: 'Timeless, romantic looks designed to make you feel unforgettable on your special day. Includes trial session and touch-up kit.',
    price: 250,
    duration: '120 min',
    image: bridalImage,
    popular: true,
    includes: [
      'Pre-wedding trial session',
      'Day-of bridal makeup',
      'Touch-up kit',
      'False lashes (premium)',
      'Waterproof formulas',
      'On-location service',
    ],
  },
  {
    id: 'evening-glam',
    title: 'Evening Glam',
    tagline: 'Make a Statement',
    description: 'Bold, dramatic makeup for galas, events, and nights when you want to turn heads. Camera-ready and long-lasting.',
    price: 150,
    duration: '90 min',
    image: glamImage,
    includes: [
      'Full glam application',
      'Dramatic eye looks',
      'Contouring & highlighting',
      'Premium false lashes',
      'Bold lip options',
      'Long-wear setting',
    ],
  },
  {
    id: 'natural-glow',
    title: 'Natural Glow',
    tagline: 'Less is More',
    description: 'Fresh, dewy looks that celebrate your natural beauty with minimal, refined touches. Perfect for photoshoots or everyday polish.',
    price: 80,
    duration: '45 min',
    image: naturalImage,
    includes: [
      'Skin-prep & hydration',
      'Lightweight coverage',
      'Cream blush & highlight',
      'Brow grooming',
      'Tinted lip balm',
      'Dewy finish spray',
    ],
  },
  {
    id: 'special-event',
    title: 'Special Event',
    tagline: 'Celebrate in Style',
    description: 'Customized makeup for proms, parties, photoshoots, and milestone celebrations. Tailored to match your outfit and theme.',
    price: 120,
    duration: '75 min',
    image: specialEventImage,
    includes: [
      'Consultation on look',
      'Full makeup application',
      'Color matching to outfit',
      'False lashes included',
      'Touch-up products',
      'Photo-ready finish',
    ],
  },
  {
    id: 'editorial',
    title: 'Editorial',
    tagline: 'Creative Vision',
    description: 'High-fashion, artistic makeup for editorial shoots, campaigns, and creative projects. Collaborative approach with photographers and stylists.',
    price: 200,
    duration: '120 min',
    image: editorialImage,
    includes: [
      'Creative consultation',
      'Mood board collaboration',
      'Artistic application',
      'Multiple look changes',
      'On-set touch-ups',
      'Product list provided',
    ],
  },
];

const bundles = [
  {
    name: 'Bridal Party Package',
    description: 'Perfect for the bride and her squad. Includes bridal makeup plus discounted rates for bridesmaids.',
    basePrice: 250,
    additionalPrice: 75,
    additionalLabel: 'per bridesmaid',
    features: [
      'Bride full bridal service',
      'Trial for bride included',
      '25% off bridesmaid makeup',
      'Group scheduling priority',
      'On-location service',
    ],
  },
  {
    name: 'Glow Up Bundle',
    description: 'Book 3 services and save. Perfect for those with multiple events coming up.',
    basePrice: 270,
    savings: 80,
    features: [
      'Any 3 services (60-90 min)',
      'Valid for 6 months',
      'Transferable to friend',
      'Priority booking',
      'Free touch-up kit',
    ],
  },
  {
    name: 'VIP Experience',
    description: 'The ultimate pampering session. Private studio, champagne, and a full glam transformation.',
    basePrice: 400,
    features: [
      'Private 2-hour session',
      'Champagne & refreshments',
      'Full glam application',
      'Makeup lesson included',
      'Premium product gift bag',
      'Professional photos',
    ],
  },
];

const ServicesCatalog = () => {
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
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Beauty <span className="italic">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From subtle everyday elegance to show-stopping glamour, discover the perfect 
              service for your unique beauty needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-card border border-border hover:border-primary/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {service.popular && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase px-3 py-1 flex items-center gap-1">
                      <Sparkles size={12} />
                      Most Popular
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-primary text-xs tracking-widest uppercase mb-1">
                        {service.tagline}
                      </p>
                      <h3 className="text-2xl font-serif">{service.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-serif text-primary">${service.price}</span>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock size={12} />
                        {service.duration}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Includes */}
                  <div className="border-t border-border pt-4 mb-6">
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                      Includes:
                    </p>
                    <ul className="space-y-2">
                      {service.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                          <Check size={14} className="text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/booking">
                    <Button variant="hero" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles Section */}
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
              Save More
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Package <span className="italic">Bundles</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-card border border-border p-8 hover:border-primary/30 transition-all duration-500"
              >
                <h3 className="text-2xl font-serif mb-2">{bundle.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {bundle.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-serif text-primary">${bundle.basePrice}</span>
                  {bundle.additionalPrice && (
                    <span className="text-muted-foreground text-sm ml-2">
                      + ${bundle.additionalPrice} {bundle.additionalLabel}
                    </span>
                  )}
                  {bundle.savings && (
                    <span className="block text-sm text-gold mt-1">
                      Save ${bundle.savings}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {bundle.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/booking">
                  <Button variant="elegant" className="w-full">
                    Book Package
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              Not Sure Which Service is Right for You?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book a free consultation and we'll help you choose the perfect look 
              for your occasion.
            </p>
            <Link to="/booking">
              <Button variant="gold" size="xl">
                Book Free Consultation
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
