import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Clock, Star, Check, Camera, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getServicesForEvent, formatCurrency, ADDONS } from '@/config/services';

const BridalServices = () => {
  const bridalServices = getServicesForEvent('wedding');
  
  const galleryImages = [
    '/IMG_8900.JPG',
    '/IMG_8901.JPG',
    '/IMG_8957.JPG',
    '/IMG_8958.JPG',
    '/IMG_8959.JPG',
    '/IMG_8916.JPG',
  ];

  const testimonials = [
    {
      name: 'Jennifer L.',
      text: 'HDA made my wedding day absolutely perfect! My makeup lasted from 10am to midnight without a single touch-up. The trial was so helpful in getting the exact look I wanted.',
      rating: 5,
    },
    {
      name: 'Amanda R.',
      text: 'My bridesmaids and I all looked stunning. The team arrived on time and worked so efficiently. Every photo from our wedding is frame-worthy!',
      rating: 5,
    },
    {
      name: 'Sarah M.',
      text: 'Worth every penny! The Complete Bridal Package was the best investment for my wedding. I felt like a princess all day long.',
      rating: 5,
    },
  ];

  const whyChooseUs = [
    { icon: Heart, title: 'Bridal Expertise', desc: '500+ weddings served with love and care' },
    { icon: Camera, title: 'Photo-Perfect', desc: 'Flawless in HD photos & video' },
    { icon: Clock, title: 'All-Day Wear', desc: 'Lasts from "I do" to last dance' },
    { icon: MapPin, title: 'On-Location', desc: 'We come to you or your venue' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Bridal Makeup & Hair Services | Wedding Day Beauty Houston"
        description="Make your wedding day perfect with professional bridal makeup and hair services. Serving Houston brides with trial sessions, bridal party packages, and on-location services."
        keywords="bridal makeup Houston, wedding makeup artist, bridal hair styling, bridesmaid makeup, wedding day glam, bridal party makeup"
        canonicalUrl="/bridal"
        ogImage="/IMG_8900.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-56 h-56 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs items={[
            { name: 'Services', url: '/services' },
            { name: 'Bridal', url: '/bridal' }
          ]} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
                Bridal Beauty
              </span>
              <Heart className="w-6 h-6 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Your Wedding <span className="italic text-primary">Day</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your wedding day deserves perfection. From the trial to the last dance, 
              we ensure you look and feel absolutely stunning for every moment of your celebration.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link to="/booking">Book Your Bridal Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/gallery">View Bridal Gallery</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-serif text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Bridal Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From intimate elopements to grand celebrations, we have packages for every type of wedding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {bridalServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card border overflow-hidden group ${
                  service.popular ? 'border-primary ring-1 ring-primary/20' : 'border-border'
                }`}
              >
                {service.popular && (
                  <div className="bg-primary text-primary-foreground text-xs text-center py-1 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-serif">{service.name}</h3>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through text-xs block">
                        {formatCurrency(service.originalPrice)}
                      </span>
                      <span className="text-lg text-primary font-medium">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {service.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      {formatCurrency(service.deposit)} deposit
                    </span>
                  </div>
                  
                  <ul className="space-y-1.5 mb-5">
                    {service.includes?.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {(service.includes?.length || 0) > 4 && (
                      <li className="text-xs text-muted-foreground">
                        + {(service.includes?.length || 0) - 4} more included
                      </li>
                    )}
                  </ul>
                  
                  <Button asChild className="w-full" size="sm">
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal Party Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Bridal Party Services
              </h2>
              <p className="text-muted-foreground">
                Make sure your entire bridal party looks stunning for your big day
              </p>
            </div>

            <div className="bg-card border border-border p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {[
                      'Professional makeup for each person',
                      'Complimentary lash application',
                      'Coordinated looks with the bride',
                      'Long-lasting setting spray',
                      'On-location service available',
                      'Group scheduling priority',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-4">Pricing</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span>Bridesmaids & MOB/MOG</span>
                      <span className="text-primary font-medium">$100/person</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span>Flower Girls (12 & under)</span>
                      <span className="text-primary font-medium">$50/person</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span>Hair Add-On (per person)</span>
                      <span className="text-primary font-medium">+$75</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    50% deposit required. Groups of 5+ receive priority scheduling.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Bridal Gallery
            </h2>
            <p className="text-muted-foreground">
              See our beautiful brides shine on their special day
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Bridal makeup ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Happy Brides
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4 text-sm">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Add-ons */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Bridal Add-Ons
            </h2>
            <p className="text-muted-foreground">
              Customize your bridal experience
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {ADDONS.filter(addon => 
              ['airbrush-upgrade', 'hair-accessories', 'travel-fee-local', 'early-morning', 'touch-up-kit'].includes(addon.id)
            ).map((addon) => (
              <div key={addon.id} className="bg-card border border-border p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{addon.name}</h4>
                  <span className="text-primary text-sm">{formatCurrency(addon.price)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Ready to Say "I Do"?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Wedding dates book up quickly! We recommend booking your bridal trial at least 
              2-3 months before your wedding date to ensure availability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/booking">Book Your Bridal Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+18329070199">Call to Discuss</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BridalServices;
