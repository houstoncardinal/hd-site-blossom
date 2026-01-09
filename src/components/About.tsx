import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroImage = '/IMG_8900.JPG';
const founderImage = '/IMG_8869.JPG';

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
            
            {/* Founder Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-8 bg-card border border-primary/30 p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={founderImage}
                  alt="Huda Javed - Founder"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <p className="font-serif text-sm">Huda Javed</p>
                  <p className="text-primary text-xs tracking-wider uppercase">Founder</p>
                </div>
              </div>
            </motion.div>
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
                Founded by Huda Javed, our team of licensed cosmetologists and expert makeup artists 
                brings years of experience in bridal, editorial, and everyday glam. We're dedicated 
                to creating looks that enhance your natural features while making you feel confident 
                and radiant.
              </p>
              <p>
                Every appointment is a personalized experience. We take time to understand your 
                vision, skin type, and preferences to deliver results that exceed your expectations.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm tracking-wider uppercase"
              >
                Meet Our Expert Team →
              </Link>
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
