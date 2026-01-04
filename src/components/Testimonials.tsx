import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Bride',
    content: 'HDA Studio made my wedding day absolutely magical. The bridal makeup was flawless and lasted all day. I felt like the most beautiful version of myself.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    role: 'Corporate Executive',
    content: 'Professional, elegant, and always on point. I trust HDA for all my important events. Their soft glam look is perfection.',
    rating: 5,
  },
  {
    name: 'Jessica Williams',
    role: 'Model',
    content: 'The attention to detail is incredible. They understand bone structure, lighting, and what looks best on camera. Truly artists.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            What Our <span className="italic">Clients</span> Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card border border-border p-8 relative group hover:border-primary/30 transition-colors duration-500"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-6 text-6xl font-serif text-primary/20 leading-none">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-8 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-6">
                <p className="font-serif text-lg">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground tracking-wider uppercase">
                  {testimonial.role}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
