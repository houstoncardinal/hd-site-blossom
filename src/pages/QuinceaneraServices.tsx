import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Clock, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { GLAM_SERVICES, formatCurrency, ADDONS } from '@/config/services';

const QuinceaneraServices = () => {
  // Use GLAM_SERVICES directly
  const quinceaneraServices = GLAM_SERVICES;
  
  const galleryImages = [
    '/IMG_8960.JPG',
    '/IMG_8963.JPG',
    '/IMG_8912.JPG',
    '/IMG_8916.JPG',
    '/IMG_8900.JPG',
    '/IMG_8901.JPG',
  ];

  const testimonials = [
    {
      name: 'Sofia M.',
      text: 'My quinceañera was magical! The makeup lasted through all the dancing and photos. Everyone asked who did my makeup!',
      rating: 5,
    },
    {
      name: 'Isabella R.',
      text: 'HDA made me feel like a princess on my XV años. The whole court looked amazing and coordinated perfectly.',
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Quinceañera Makeup & Hair Services | XV Años Glam Houston"
        description="Make your XV años unforgettable with professional quinceañera makeup and hair services. Beautiful looks for the quinceañera and her court. Book your glam session today!"
        keywords="quinceañera makeup Houston, XV años makeup, quinceañera hair styling, damas makeup, quinceañera court glam, sweet 15 makeup artist"
        canonicalUrl="/quinceanera"
        ogImage="/IMG_8960.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs items={[
            { name: 'Services', url: '/services' },
            { name: 'Quinceañera', url: '/quinceanera' }
          ]} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-primary" />
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
                XV Años
              </span>
              <Crown className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Quinceañera <span className="italic text-primary">Glam</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your XV años is a once-in-a-lifetime celebration. Let us make you feel like the princess you are 
              with stunning makeup and hair that will shine in every photo and memory.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link to="/booking">Book Your Glam Session</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Quinceañera Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From the quinceañera to her entire court, we have packages to make everyone look stunning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quinceaneraServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border overflow-hidden group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image || '/IMG_8960.JPG'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif">{service.name}</h3>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through text-sm block">
                        {formatCurrency(service.originalPrice)}
                      </span>
                      <span className="text-xl text-primary font-medium">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {service.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={14} />
                      {formatCurrency(service.deposit)} deposit
                    </span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {service.includes?.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="w-full">
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
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
              XV Años Gallery
            </h2>
            <p className="text-muted-foreground">
              See how we've helped quinceañeras shine on their special day
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
                  alt={`Quinceañera makeup ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Add-ons */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Popular Add-Ons
            </h2>
            <p className="text-muted-foreground">
              Enhance your quinceañera look with these extras
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {ADDONS.filter(addon => 
              ['airbrush-upgrade', 'glitter-gems', 'hair-accessories', 'travel-fee-local'].includes(addon.id)
            ).map((addon) => (
              <div key={addon.id} className="bg-card border border-border p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{addon.name}</h4>
                  <span className="text-primary">{formatCurrency(addon.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Happy Quinceañeras
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.name}</p>
              </motion.div>
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
            <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Ready for Your XV Años?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Book early to secure your date! We recommend booking at least 2-3 months in advance 
              for quinceañera services.
            </p>
            <Button asChild size="lg">
              <Link to="/booking">Book Your Quinceañera Glam</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default QuinceaneraServices;
