import { motion } from 'framer-motion';
import { Shield, Sparkles, Check } from 'lucide-react';

const Sanitation = () => {
  const practices = [
    'Lipstick and mascara are never applied directly from their original packaging',
    'Products are always dispensed using clean tools and disposable applicators',
    'A fresh beauty blender is used for each client',
    'All brushes are washed and sanitized before every appointment',
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="text-primary" size={28} />
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
                Your Safety First
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Sanitation & <span className="italic">Hygiene</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card border border-border p-8 md:p-12"
          >
            <p className="text-muted-foreground leading-relaxed text-lg mb-8 text-center">
              We take sanitation very seriously to ensure every client feels comfortable and at ease.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {practices.map((practice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 bg-muted/50 p-4"
                >
                  <Check size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {practice}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center text-muted-foreground leading-relaxed flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="italic">
                Cleanliness and care are an essential part of the experience we provide.
              </span>
              <Sparkles size={16} className="text-primary" />
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Sanitation;