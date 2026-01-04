import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase mb-6 block font-sans">
            Ready to Transform?
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-8">
            Your Beauty Journey <span className="italic">Starts Here</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Schedule your appointment today and discover the art of personalized beauty. 
            Let us help you feel confident and radiant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl">
              Schedule Your Time
            </Button>
            <Button variant="heroOutline" size="xl">
              Schedule Your Bundle
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
