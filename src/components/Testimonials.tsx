import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  client_name: string;
  rating: number;
  review_text: string | null;
  service_name: string | null;
}

// Fallback testimonials for when database is empty
const fallbackTestimonials = [
  {
    id: 'fallback-1',
    client_name: 'Sarah Mitchell',
    rating: 5,
    review_text: 'HDA Studio made my wedding day absolutely magical. The bridal makeup was flawless and lasted all day. I felt like the most beautiful version of myself.',
    service_name: 'Bridal',
  },
  {
    id: 'fallback-2',
    client_name: 'Emily Chen',
    rating: 5,
    review_text: 'Professional, elegant, and always on point. I trust HDA for all my important events. Their soft glam look is perfection.',
    service_name: 'Soft Glam',
  },
  {
    id: 'fallback-3',
    client_name: 'Jessica Williams',
    rating: 5,
    review_text: 'The attention to detail is incredible. They understand bone structure, lighting, and what looks best on camera. Truly artists.',
    service_name: 'Editorial',
  },
];

const Testimonials = () => {
  const { data: reviews } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as Review[];
    },
  });

  const displayReviews = reviews && reviews.length > 0 ? reviews : fallbackTestimonials;

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
          {displayReviews.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
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
                "{testimonial.review_text}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-6">
                <p className="font-serif text-lg">{testimonial.client_name}</p>
                <p className="text-sm text-muted-foreground tracking-wider uppercase">
                  {testimonial.service_name || 'Client'}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link 
            to="/reviews" 
            className="text-primary hover:text-primary/80 transition-colors text-sm tracking-widest uppercase"
          >
            View All Reviews →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
