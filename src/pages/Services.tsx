import { motion } from 'framer-motion';
import { Check, Clock, Sparkles, Scissors, Palette, Heart, Star, Users, MapPin, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceSchema from '@/components/ServiceSchema';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import {
  MAKEUP_SERVICES,
  HAIR_SERVICES,
  COMBO_PACKAGES,
  EVENT_PACKAGES,
  BUNDLES,
  ADDONS,
  formatCurrency,
  calculateSavings,
  type ServiceConfig,
} from '@/config/services';

const ServiceCard = ({ service, index }: { service: ServiceConfig; index: number }) => {
  const savings = calculateSavings(service.originalPrice, service.price);
  
  return (
    <motion.article
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
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {service.popular && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase px-3 py-1 flex items-center gap-1">
            <Sparkles size={12} />
            Most Popular
          </div>
        )}
        {savings > 50 && (
          <div className="absolute top-4 left-4 bg-green-600 text-white text-xs tracking-widest uppercase px-3 py-1">
            Save {formatCurrency(savings)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-primary text-xs tracking-widest uppercase mb-1">
              {service.category === 'makeup' && 'Makeup Service'}
              {service.category === 'hair' && 'Hair Service'}
              {service.category === 'combo' && 'Hair + Makeup'}
              {service.category === 'bridal' && 'Bridal'}
              {service.category === 'event' && 'Special Event'}
              {service.category === 'bundle' && 'Package'}
            </p>
            <h3 className="text-2xl font-serif">{service.name}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(service.originalPrice)}
              </span>
              <span className="text-2xl font-serif text-primary">
                {formatCurrency(service.price)}
              </span>
            </div>
            {savings > 0 && (
              <span className="text-xs text-green-500 font-medium">
                Save {formatCurrency(savings)}
              </span>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
              <Clock size={12} />
              {service.duration}
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Includes */}
        {service.includes && (
          <div className="border-t border-border pt-4 mb-6">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
              Includes:
            </p>
            <ul className="space-y-2">
              {service.includes.slice(0, 5).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
              {service.includes.length > 5 && (
                <li className="text-xs text-muted-foreground italic">
                  +{service.includes.length - 5} more included
                </li>
              )}
            </ul>
          </div>
        )}

        <Link to="/booking">
          <Button variant="hero" className="w-full">
            Book Now • {formatCurrency(service.deposit)} deposit
          </Button>
        </Link>
      </div>
    </motion.article>
  );
};

const ServicesCatalog = () => {
  // Combine services for SEO schema
  const allServicesForSchema = [...MAKEUP_SERVICES, ...HAIR_SERVICES, ...COMBO_PACKAGES].map(s => ({
    id: s.id,
    title: s.name,
    description: s.description,
    price: s.price,
    image: s.image,
    duration: s.duration,
    keywords: s.category,
    seoDescription: s.description,
    includes: s.includes || [],
  }));

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Hair & Makeup Services - Professional Beauty Artist"
        description="Complete beauty services including professional makeup, hair styling, bridal packages, and event glam. Prices from $75. Quinceañera, Prom, Senior Portraits & more. Book today!"
        keywords="makeup artist, hair stylist, bridal makeup, bridal hair, wedding makeup, prom makeup, quinceañera makeup, senior portraits makeup, event makeup, soft glam, airbrush makeup, formal updo, hair styling"
        canonicalUrl="/services"
        ogImage="/IMG_8900.JPG"
      />

      <ServiceSchema services={allServicesForSchema} />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' }
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Services', url: '/services' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Complete Beauty Services
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Hair & Makeup <span className="italic">Artistry</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              From natural everyday beauty to show-stopping glamour. Professional makeup, 
              stunning hair styling, and complete transformation packages for every occasion.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <Palette className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">{MAKEUP_SERVICES.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Makeup Looks</p>
              </div>
              <div className="text-center">
                <Scissors className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">{HAIR_SERVICES.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hair Styles</p>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-serif">{EVENT_PACKAGES.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Event Packages</p>
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

      {/* Main Services Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="makeup" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-12 bg-transparent h-auto">
              <TabsTrigger 
                value="makeup" 
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Palette size={16} className="mr-2" />
                Makeup
              </TabsTrigger>
              <TabsTrigger 
                value="hair"
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Scissors size={16} className="mr-2" />
                Hair
              </TabsTrigger>
              <TabsTrigger 
                value="combos"
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Sparkles size={16} className="mr-2" />
                Hair + Makeup
              </TabsTrigger>
              <TabsTrigger 
                value="bridal"
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Heart size={16} className="mr-2" />
                Bridal
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Crown size={16} className="mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="bundles"
                className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border"
              >
                <Users size={16} className="mr-2" />
                Packages
              </TabsTrigger>
            </TabsList>

            {/* Makeup Services */}
            <TabsContent value="makeup">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Makeup <span className="italic">Services</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  From natural soft glam to show-stopping editorial looks. All services include 
                  complimentary lash application and long-lasting setting spray.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {MAKEUP_SERVICES.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Hair Services */}
            <TabsContent value="hair">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Hair <span className="italic">Styling</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional hair styling for every occasion. From sleek blowouts to 
                  intricate updos and Hollywood-inspired waves.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {HAIR_SERVICES.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Combo Packages */}
            <TabsContent value="combos">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Hair + Makeup <span className="italic">Combos</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Complete transformations at discounted package rates. Save up to $80 
                  when you book hair and makeup together.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {COMBO_PACKAGES.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Bridal Services */}
            <TabsContent value="bridal">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Bridal <span className="italic">Services</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Make your wedding day unforgettable. From bridal trials to complete 
                  packages for you and your entire party.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {EVENT_PACKAGES.filter(s => s.category === 'bridal').map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Event Services */}
            <TabsContent value="events">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Special <span className="italic">Events</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Quinceañera, Prom, Senior Portraits, Maternity sessions, and more. 
                  Look stunning for life's milestone moments.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {EVENT_PACKAGES.filter(s => s.category === 'event').map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Bundles */}
            <TabsContent value="bundles">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  Package <span className="italic">Deals</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Save big with our multi-service bundles. Perfect for group events, 
                  VIP experiences, or multiple occasions.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {BUNDLES.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add-Ons Section */}
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
              Enhance Your Look
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Add-On <span className="italic">Services</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Customize your service with premium enhancements. Available with any booking.
            </p>
          </motion.div>

          {/* Add-ons by category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Makeup Add-Ons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-primary" size={24} />
                <h3 className="text-xl font-serif">Makeup Upgrades</h3>
              </div>
              <div className="space-y-4">
                {ADDONS.filter(a => a.category === 'makeup').map((addon) => (
                  <div key={addon.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <h4 className="font-medium text-sm">{addon.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                    </div>
                    <span className="text-primary font-serif whitespace-nowrap ml-4">
                      {addon.priceRange || formatCurrency(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hair Add-Ons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Scissors className="text-primary" size={24} />
                <h3 className="text-xl font-serif">Hair Upgrades</h3>
              </div>
              <div className="space-y-4">
                {ADDONS.filter(a => a.category === 'hair').map((addon) => (
                  <div key={addon.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <h4 className="font-medium text-sm">{addon.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                    </div>
                    <span className="text-primary font-serif whitespace-nowrap ml-4">
                      {addon.priceRange || formatCurrency(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* General Add-Ons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-primary" size={24} />
                <h3 className="text-xl font-serif">Travel & Extras</h3>
              </div>
              <div className="space-y-4">
                {ADDONS.filter(a => a.category === 'general').map((addon) => (
                  <div key={addon.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <h4 className="font-medium text-sm">{addon.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                    </div>
                    <span className="text-primary font-serif whitespace-nowrap ml-4">
                      {addon.priceRange || formatCurrency(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Airbrush callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8 text-center"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-serif mb-2">Upgrade to Airbrush Makeup</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Experience flawless, long-lasting coverage with our airbrush makeup upgrade. 
              Perfect for photography, weddings, and all-day events.
            </p>
            <p className="text-primary text-xl font-serif">+$35 to any makeup service</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              for your occasion. We work with all skin tones and ethnicities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button variant="gold" size="xl">
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/#contact">
                <Button variant="elegant" size="xl">
                  Send Inquiry
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ServicesCatalog;
