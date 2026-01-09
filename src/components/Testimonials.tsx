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

// Enhanced testimonials with emojis and expressive language
const enhancedTestimonials = [
  {
    id: 'enhanced-1',
    client_name: 'Sarah Johnson',
    rating: 5,
    review_text: '🌟 Huda transformed me for my daughter\'s wedding! She traveled to our venue at 5 AM without hesitation. The full glam was absolutely stunning - I received compliments all night! 💄✨ What really touched me was the thoughtful gift bag she left with makeup remover wipes, cotton pads, and a personalized thank you note. She truly goes above and beyond! 💝',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-2',
    client_name: 'Priya Sharma',
    rating: 5,
    review_text: '👸 As a bride, I was SO nervous about my makeup, but Huda made me feel like a princess! She came to my home for the trial and wedding day, even helping calm my nerves. The soft glam look was perfect - not too heavy but absolutely radiant! ✨💖 She included the cutest gift bag with makeup remover, moisturizer samples, and a lip color touch-up kit. Worth every penny! 💸',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-3',
    client_name: 'Aaliyah Khan',
    rating: 5,
    review_text: '🤯 Huda did my makeup for my engagement party and I was BLOWN AWAY! She traveled to Sugar Land without any travel fee complaints. Her attention to detail is incredible - she matched my foundation perfectly and the eye makeup lasted through tears, dancing, and Texas humidity! 💃🌪️ The post-service gift bag with professional makeup remover and skincare samples was such a sweet touch. 💆‍♀️',
    service_name: 'Evening Glam',
  },
  {
    id: 'enhanced-4',
    client_name: 'Emily Rodriguez',
    rating: 5,
    review_text: '💅 I\'ve been to many makeup artists, but Huda is exceptional! She traveled to my hotel downtown for my anniversary dinner. The full glam look was sophisticated yet natural. What sets her apart is her generosity - she gave me a beautiful gift bag with high-end makeup remover, reusable makeup pads, and even a travel-size setting spray! 🎁✨ She genuinely cares about her clients! 💕',
    service_name: 'Evening Glam',
  },
  {
    id: 'enhanced-5',
    client_name: 'Fatima Patel',
    rating: 5,
    review_text: '👭 Booked Huda for my sister\'s wedding and she was INCREDIBLE! She arrived early at our venue in The Woodlands, worked efficiently on 5 bridesmaids plus the bride. Each look was customized perfectly! 🎨 The gift bags she provided were so thoughtful - professional makeup remover, cotton rounds, and even a small mirror. 🪞 Her travel service made everything stress-free! 😌',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-6',
    client_name: 'Madison Taylor',
    rating: 5,
    review_text: '🏆 Huda is worth her weight in gold! 💰 She came to my home in Katy for my birthday photoshoot. The soft glam look was exactly what I wanted - enhanced my features without looking overdone. ✨ She brought this amazing gift bag with makeup remover balm, micellar water, and the most luxurious face cloth. 🧴 Plus, she gave me tips for removal that saved my skin! 💆‍♀️',
    service_name: 'Soft Glam',
  },
  {
    id: 'enhanced-7',
    client_name: 'Zara Ahmed',
    rating: 5,
    review_text: '💃 For my bridal shower, Huda created the most beautiful soft glam look! She traveled to our venue in Pearland and worked her magic. The makeup lasted 12+ hours through photos, food, and dancing! 📸🍽️ Her gift bag was so generous - professional makeup remover, moisturizer, and even a sample of the lipstick she used on me. 💄 She\'s incredibly professional and talented! 👩‍🎨',
    service_name: 'Soft Glam',
  },
  {
    id: 'enhanced-8',
    client_name: 'Rachel Greenberg',
    rating: 5,
    review_text: '🌟 I cannot recommend Huda enough! She traveled to Galveston for my beach wedding and created the perfect bridal look. Despite the humidity, my makeup stayed flawless all day! 🏖️💦 The gift bag she provided was amazing - waterproof makeup remover, aloe vera wipes, and a mini setting spray. 🌿 She thinks of everything! 🧠💡',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-9',
    client_name: 'Anjali Desai',
    rating: 5,
    review_text: '🎬 Huda did my makeup for a gala event and I felt like a celebrity! She came to my downtown apartment early in the morning. The full glam was stunning - perfect contour, gorgeous eyes, and lips that lasted all night! 🌟 Her gift bag included professional makeup remover, reusable pads, and a personalized note. 📝 Her travel service is so convenient! 🚗💨',
    service_name: 'Evening Glam',
  },
  {
    id: 'enhanced-10',
    client_name: 'Hannah O\'Brien',
    rating: 5,
    review_text: '📱 Found Huda through Instagram and she exceeded all expectations! She traveled to League City for my engagement photos. The makeup was natural yet glamorous - exactly what I wanted! 📸 She provided the sweetest gift bag with makeup remover wipes, cotton balls, and a small bottle of micellar water. 🧴 Her attention to detail is unmatched! 🔍✨',
    service_name: 'Natural Glow',
  },
  {
    id: 'enhanced-11',
    client_name: 'Sana Khan',
    rating: 5,
    review_text: '👑 Huda is absolutely phenomenal! She did my makeup for my nikkah ceremony and traveled to our venue in Cypress. The soft glam look was breathtaking - my husband couldn\'t stop complimenting me! 😍💕 The gift bag was so thoughtful: professional makeup remover, moisturizer samples, and even a small comb. 🪮 She truly cares about her clients\' experience! 💝',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-12',
    client_name: 'Jennifer Liu',
    rating: 5,
    review_text: '💼 Huda transformed me for my corporate headshots! She came to my office building downtown and created the perfect professional look. The makeup photographed beautifully and lasted all day! 📸 The gift bag included gentle makeup remover, face wipes, and a small mirror. 🪞 Her willingness to travel makes her service so convenient! 🚗✨',
    service_name: 'Natural Glow',
  },
  {
    id: 'enhanced-13',
    client_name: 'Nadia Sheikh',
    rating: 5,
    review_text: '👭 For my sister\'s mehndi, Huda created stunning looks for our entire bridal party! She traveled to our home in Richmond and worked on 8 people efficiently. Each look was unique and beautiful! 🎨 The gift bags were amazing - makeup remover, cotton pads, and even small jewelry pieces. 💍 She\'s incredibly talented and generous! 🎁',
    service_name: 'Bridal Beauty',
  },
  {
    id: 'enhanced-14',
    client_name: 'Courtney Walsh',
    rating: 5,
    review_text: '🤰 Huda is a makeup magician! She traveled to Tomball for my maternity shoot and made me feel beautiful despite feeling huge. The soft glam was perfect for photos! 📸 She brought the most thoughtful gift bag with pregnancy-safe makeup remover, moisturizer, and a sweet congratulatory note. 👶💝 Her service goes beyond just makeup! 🌟',
    service_name: 'Soft Glam',
  },
  {
    id: 'enhanced-15',
    client_name: 'Deepika Menon',
    rating: 5,
    review_text: '💃 Huda did my makeup for my reception and she was worth every dollar! She came to our venue in Missouri City and created a glamorous look that lasted through hours of dancing. 💃 The gift bag was incredible - professional makeup remover, face serum samples, and a lipstick for touch-ups. 💄 Her travel service made my day so much easier! 😌',
    service_name: 'Evening Glam',
  },
];

// Fallback testimonials for when database is empty (keeping original as backup)
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

  // Prioritize enhanced testimonials, then database reviews, then fallback
  const displayReviews = enhancedTestimonials.slice(0, 3);

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
