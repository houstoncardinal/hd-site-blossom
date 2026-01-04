import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-beauty.jpg';

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-charcoal-light">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={heroImage}
                alt="HDA Studio - Professional makeup artistry"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-primary/30 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-8"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">
              The Art of <span className="italic">Beauty</span>
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                At HDA Studio, we believe that makeup is more than just cosmetics—it's an art form 
                that celebrates your unique beauty. Our studio is a sanctuary where luxury meets 
                personal expression.
              </p>
              <p>
                With years of experience in bridal, editorial, and everyday glam, our talented 
                artists are dedicated to creating looks that enhance your natural features while 
                making you feel confident and radiant.
              </p>
              <p>
                Every appointment is a personalized experience. We take time to understand your 
                vision, skin type, and preferences to deliver results that exceed your expectations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <span className="text-3xl md:text-4xl font-serif text-primary">500+</span>
                <p className="text-sm text-muted-foreground mt-1 tracking-wider uppercase">Happy Clients</p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-serif text-primary">5+</span>
                <p className="text-sm text-muted-foreground mt-1 tracking-wider uppercase">Years Experience</p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-serif text-primary">100%</span>
                <p className="text-sm text-muted-foreground mt-1 tracking-wider uppercase">Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
