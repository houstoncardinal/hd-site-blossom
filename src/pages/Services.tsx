import { motion } from 'framer-motion';
import { Check, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceSchema from '@/components/ServiceSchema';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';

const services = [
  {
    id: 'basic-soft-glam',
    title: 'Basic Soft Glam',
    tagline: 'Natural & Polished',
    description: 'Our essential everyday look featuring natural, polished beauty with soft definition. Perfect for work, casual outings, or any time you want to look effortlessly put together without appearing overdone.',
    seoDescription: 'Natural makeup look with soft definition. Professional basic soft glam makeup service including skin prep, full coverage base, complimentary lashes, and lip color. Starting at $90.',
    price: 90,
    originalPrice: 112,
    duration: '45 min',
    image: '/IMG_8863.JPG',
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
    keywords: 'basic makeup, soft glam, natural makeup, everyday makeup, polished look',
  },
  {
    id: 'soft-glam',
    title: 'Soft Glam',
    tagline: 'Enhanced Everyday Elegance',
    description: 'Elevated everyday glamour with gentle definition and refined sophistication. Ideal for brunch dates, professional photoshoots, or daytime events where you want to radiate confidence and grace.',
    seoDescription: 'Enhanced soft glam makeup with gentle definition. Includes full coverage, soft contour, defined eyeshadow, complimentary lashes for elevated everyday beauty. Starting at $108.',
    price: 108,
    originalPrice: 135,
    duration: '60 min',
    image: '/IMG_8865.JPG',
    includes: [
      'Full coverage base with skin perfection',
      'Soft contour or bronzer application',
      'Blush placement for dimension',
      'Defined eyeshadow with blending',
      'Brow enhancement & definition',
      'Complimentary lash application',
      'Perfectly matched lip color',
      'Professional finishing & setting',
    ],
    keywords: 'soft glam makeup, enhanced makeup, everyday glam, contour makeup, defined eyes',
  },
  {
    id: 'standard-glam',
    title: 'Standard Glam',
    tagline: 'Event-Ready Perfection',
    description: 'Balanced, camera-ready glamour designed for special occasions. The perfect choice for weddings (as a guest), parties, date nights, and formal events where you want to make a lasting impression.',
    seoDescription: 'Event-ready glam makeup service with full coverage, contour, highlighter, and defined eye looks. Professional makeup for weddings, parties, and special occasions. Starting at $144.',
    price: 144,
    originalPrice: 180,
    duration: '75 min',
    image: '/IMG_8916.JPG',
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
    keywords: 'standard glam, event makeup, party makeup, wedding guest makeup, camera ready makeup',
  },
  {
    id: 'signature-glam',
    title: 'Signature Glam',
    tagline: 'Bold Statement Beauty',
    description: 'Our premium signature service featuring show-stopping glamour with intricate artistry. Perfect for galas, red carpet events, fashion shows, editorials, and moments when you want to be absolutely unforgettable.',
    seoDescription: 'Signature glam makeup with full contouring, enhanced eye makeup, glitter, cut crease, and premium finishing. Ultimate luxury makeup service for special occasions. Starting at $180.',
    price: 180,
    originalPrice: 225,
    duration: '90 min',
    image: '/IMG_8912.JPG',
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
    keywords: 'signature glam, premium makeup, glitter makeup, cut crease, editorial makeup, luxury makeup service',
  },
];

const addOns = [
  {
    name: 'Ombre Lips',
    price: 18,
    description: 'Gradient lip color technique for dimension and fullness',
  },
  {
    name: 'Winged Eyeliner / Lashes',
    price: 18,
    description: 'Precision winged eyeliner with enhanced lash application',
  },
  {
    name: 'Scarf Setting',
    price: '12-18',
    description: 'Traditional scarf wrapping technique for flawless, long-lasting makeup',
  },
  {
    name: 'Highlighter Upgrade',
    price: 12,
    description: 'Premium highlighter application for enhanced glow (available for any glam level)',
  },
  {
    name: 'Contour Upgrade',
    price: 12,
    description: 'Advanced contouring techniques for superior definition (available for any glam level)',
  },
  {
    name: 'Jewellery Setting',
    price: '12-24',
    description: 'Expert application of face jewels, gems, or embellishments',
  },
];

const bundles = [
  {
    name: 'Bridal Party Package',
    description: 'Perfect for the bride and her squad. Includes bridal makeup plus discounted rates for bridesmaids.',
    basePrice: 300,
    additionalPrice: 90,
    additionalLabel: 'per bridesmaid',
    features: [
      'Bride receives Signature Glam service',
      'Pre-wedding trial for bride included',
      '25% discount on bridesmaid makeup',
      'Group scheduling priority',
      'On-location service available',
      'Complementary touch-up kit for bride',
    ],
  },
  {
    name: 'Glow Up Bundle',
    description: 'Book 3 services and save. Perfect for those with multiple events coming up.',
    basePrice: 324,
    savings: 96,
    features: [
      'Any 3 makeup services',
      'Valid for 6 months from purchase',
      'Transferable to a friend',
      'Priority booking access',
      'Free professional touch-up kit',
      'Flexible scheduling options',
    ],
  },
  {
    name: 'VIP Experience',
    description: 'The ultimate pampering session. Private studio, champagne, and a full glam transformation.',
    basePrice: 480,
    features: [
      'Private 2-hour exclusive session',
      'Champagne & gourmet refreshments',
      'Signature Glam full application',
      'One-on-one makeup lesson included',
      'Premium product gift bag ($100 value)',
      'Professional photography session',
      'Luxury studio experience',
    ],
  },
];

const ServicesCatalog = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Professional Makeup Services - Glam Makeup Artist"
        description="Luxury makeup services from $90. Basic Soft Glam, Soft Glam, Standard Glam, and Signature Glam. Expert makeup artistry for all occasions. Premium service packages available. Book your appointment today."
        keywords="makeup artist, glam makeup, professional makeup, bridal makeup, event makeup, soft glam, signature glam, makeup services, beauty services, luxury makeup, makeup packages, wedding makeup, party makeup"
        canonicalUrl="/services"
        ogImage="/IMG_8900.JPG"
      />

      <ServiceSchema services={services} />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Services', url: '/services' }]} />
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

      {/* Add-Ons Section */}
      <section className="py-20 bg-background">
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
              Makeup <span className="italic">Add-Ons</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Customize your service with premium enhancements. Available with any glam level.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-serif">{addon.name}</h3>
                  <span className="text-primary font-serif text-xl">
                    {typeof addon.price === 'number' ? `$${addon.price}` : `$${addon.price}`}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {addon.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground italic">
              All services include full coverage base, complimentary lashes, and lip color
            </p>
          </motion.div>
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
