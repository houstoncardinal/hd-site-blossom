import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import AggregateRatingSchema from '@/components/seo/AggregateRatingSchema';

// Enhanced testimonials with emojis and expressive language
const enhancedReviews = [
  {
    id: 'enhanced-1',
    client_name: 'Sarah Johnson',
    rating: 5,
    review_text: '🌟 Huda transformed me for my daughter\'s wedding! She traveled to our venue at 5 AM without hesitation. The full glam was absolutely stunning - I received compliments all night! 💄✨ What really touched me was the thoughtful gift bag she left with makeup remover wipes, cotton pads, and a personalized thank you note. She truly goes above and beyond! 💝',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'enhanced-2',
    client_name: 'Priya Sharma',
    rating: 5,
    review_text: '👸 As a bride, I was SO nervous about my makeup, but Huda made me feel like a princess! She came to my home for the trial and wedding day, even helping calm my nerves. The soft glam look was perfect - not too heavy but absolutely radiant! ✨💖 She included the cutest gift bag with makeup remover, moisturizer samples, and a lip color touch-up kit. Worth every penny! 💸',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'enhanced-3',
    client_name: 'Aaliyah Khan',
    rating: 5,
    review_text: '🤯 Huda did my makeup for my engagement party and I was BLOWN AWAY! She traveled to Sugar Land without any travel fee complaints. Her attention to detail is incredible - she matched my foundation perfectly and the eye makeup lasted through tears, dancing, and Texas humidity! 💃🌪️ The post-service gift bag with professional makeup remover and skincare samples was such a sweet touch. 💆‍♀️',
    service_name: 'Evening Glam',
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 'enhanced-4',
    client_name: 'Emily Rodriguez',
    rating: 5,
    review_text: '💅 I\'ve been to many makeup artists, but Huda is exceptional! She traveled to my hotel downtown for my anniversary dinner. The full glam look was sophisticated yet natural. What sets her apart is her generosity - she gave me a beautiful gift bag with high-end makeup remover, reusable makeup pads, and even a travel-size setting spray! 🎁✨ She genuinely cares about her clients! 💕',
    service_name: 'Evening Glam',
    created_at: '2024-01-04T00:00:00Z',
  },
  {
    id: 'enhanced-5',
    client_name: 'Fatima Patel',
    rating: 5,
    review_text: '👭 Booked Huda for my sister\'s wedding and she was INCREDIBLE! She arrived early at our venue in The Woodlands, worked efficiently on 5 bridesmaids plus the bride. Each look was customized perfectly! 🎨 The gift bags she provided were so thoughtful - professional makeup remover, cotton rounds, and even a small mirror. 🪞 Her travel service made everything stress-free! 😌',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 'enhanced-6',
    client_name: 'Madison Taylor',
    rating: 5,
    review_text: '🏆 Huda is worth her weight in gold! 💰 She came to my home in Katy for my birthday photoshoot. The soft glam look was exactly what I wanted - enhanced my features without looking overdone. ✨ She brought this amazing gift bag with makeup remover balm, micellar water, and the most luxurious face cloth. 🧴 Plus, she gave me tips for removal that saved my skin! 💆‍♀️',
    service_name: 'Soft Glam',
    created_at: '2024-01-06T00:00:00Z',
  },
  {
    id: 'enhanced-7',
    client_name: 'Zara Ahmed',
    rating: 5,
    review_text: '💃 For my bridal shower, Huda created the most beautiful soft glam look! She traveled to our venue in Pearland and worked her magic. The makeup lasted 12+ hours through photos, food, and dancing! 📸🍽️ Her gift bag was so generous - professional makeup remover, moisturizer, and even a sample of the lipstick she used on me. 💄 She\'s incredibly professional and talented! 👩‍🎨',
    service_name: 'Soft Glam',
    created_at: '2024-01-07T00:00:00Z',
  },
  {
    id: 'enhanced-8',
    client_name: 'Rachel Greenberg',
    rating: 5,
    review_text: '🌟 I cannot recommend Huda enough! She traveled to Galveston for my beach wedding and created the perfect bridal look. Despite the humidity, my makeup stayed flawless all day! 🏖️💦 The gift bag she provided was amazing - waterproof makeup remover, aloe vera wipes, and a mini setting spray. 🌿 She thinks of everything! 🧠💡',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-08T00:00:00Z',
  },
  {
    id: 'enhanced-9',
    client_name: 'Anjali Desai',
    rating: 5,
    review_text: '🎬 Huda did my makeup for a gala event and I felt like a celebrity! She came to my downtown apartment early in the morning. The full glam was stunning - perfect contour, gorgeous eyes, and lips that lasted all night! 🌟 Her gift bag included professional makeup remover, reusable pads, and a personalized note. 📝 Her travel service is so convenient! 🚗💨',
    service_name: 'Evening Glam',
    created_at: '2024-01-09T00:00:00Z',
  },
  {
    id: 'enhanced-10',
    client_name: 'Hannah O\'Brien',
    rating: 5,
    review_text: '📱 Found Huda through Instagram and she exceeded all expectations! She traveled to League City for my engagement photos. The makeup was natural yet glamorous - exactly what I wanted! 📸 She provided the sweetest gift bag with makeup remover wipes, cotton balls, and a small bottle of micellar water. 🧴 Her attention to detail is unmatched! 🔍✨',
    service_name: 'Natural Glow',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'enhanced-11',
    client_name: 'Sana Khan',
    rating: 5,
    review_text: '👑 Huda is absolutely phenomenal! She did my makeup for my nikkah ceremony and traveled to our venue in Cypress. The soft glam look was breathtaking - my husband couldn\'t stop complimenting me! 😍💕 The gift bag was so thoughtful: professional makeup remover, moisturizer samples, and even a small comb. 🪮 She truly cares about her clients\' experience! 💝',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-11T00:00:00Z',
  },
  {
    id: 'enhanced-12',
    client_name: 'Jennifer Liu',
    rating: 5,
    review_text: '💼 Huda transformed me for my corporate headshots! She came to my office building downtown and created the perfect professional look. The makeup photographed beautifully and lasted all day! 📸 The gift bag included gentle makeup remover, face wipes, and a small mirror. 🪞 Her willingness to travel makes her service so convenient! 🚗✨',
    service_name: 'Natural Glow',
    created_at: '2024-01-12T00:00:00Z',
  },
  {
    id: 'enhanced-13',
    client_name: 'Nadia Sheikh',
    rating: 5,
    review_text: '👭 For my sister\'s mehndi, Huda created stunning looks for our entire bridal party! She traveled to our home in Richmond and worked on 8 people efficiently. Each look was unique and beautiful! 🎨 The gift bags were amazing - makeup remover, cotton pads, and even small jewelry pieces. 💍 She\'s incredibly talented and generous! 🎁',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-13T00:00:00Z',
  },
  {
    id: 'enhanced-14',
    client_name: 'Courtney Walsh',
    rating: 5,
    review_text: '🤰 Huda is a makeup magician! She traveled to Tomball for my maternity shoot and made me feel beautiful despite feeling huge. The soft glam was perfect for photos! 📸 She brought the most thoughtful gift bag with pregnancy-safe makeup remover, moisturizer, and a sweet congratulatory note. 👶💝 Her service goes beyond just makeup! 🌟',
    service_name: 'Soft Glam',
    created_at: '2024-01-14T00:00:00Z',
  },
  {
    id: 'enhanced-15',
    client_name: 'Deepika Menon',
    rating: 5,
    review_text: '💃 Huda did my makeup for my reception and she was worth every dollar! She came to our venue in Missouri City and created a glamorous look that lasted through hours of dancing. 💃 The gift bag was incredible - professional makeup remover, face serum samples, and a lipstick for touch-ups. 💄 Her travel service made my day so much easier! 😌',
    service_name: 'Evening Glam',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'enhanced-16',
    client_name: 'Samantha Brooks',
    rating: 5,
    review_text: '💃 Huda did my makeup for a charity gala and I received endless compliments! She traveled to my hotel in River Oaks and arrived perfectly on time. The full glam was sophisticated and lasted all night! 🌟 Her gift bag included premium makeup remover, reusable makeup pads, and setting spray. 💆‍♀️ She\'s professional, talented, and so generous! 👩‍🎨',
    service_name: 'Evening Glam',
    created_at: '2024-01-16T00:00:00Z',
  },
  {
    id: 'enhanced-17',
    client_name: 'Mariam Hussain',
    rating: 5,
    review_text: '🎓 Huda did my makeup for my graduation ceremony and I was thrilled! She traveled to Clear Lake and gave me the perfect soft glam look. The makeup lasted through tears of joy and Texas heat! 😢🌞 Her gift bag was so generous - makeup remover, moisturizer, and even a small graduation gift. 🎓 She makes every experience special! ✨',
    service_name: 'Soft Glam',
    created_at: '2024-01-17T00:00:00Z',
  },
  {
    id: 'enhanced-18',
    client_name: 'Lisa Goldstein',
    rating: 5,
    review_text: '🎂 Huda is incredible! She came to my home in Memorial for my 50th birthday party. The makeup was age-appropriate yet glamorous - I felt amazing! ✨ She provided a beautiful gift bag with gentle makeup remover, anti-aging serum samples, and a personalized note. 📝 Her travel service is so convenient for busy women! 🚗💨',
    service_name: 'Soft Glam',
    created_at: '2024-01-18T00:00:00Z',
  },
  {
    id: 'enhanced-19',
    client_name: 'Priya Iyer',
    rating: 5,
    review_text: '👶 For my baby shower, Huda created the most beautiful natural look! She traveled to our venue in Stafford and was so patient with my requests. The makeup lasted all day through games and photos! 📸 Her gift bag included gentle makeup remover, face wipes safe for pregnancy, and a small baby-themed gift. 🍼 She\'s so thoughtful! 💝',
    service_name: 'Natural Glow',
    created_at: '2024-01-19T00:00:00Z',
  },
  {
    id: 'enhanced-20',
    client_name: 'Ashley Martinez',
    rating: 5,
    review_text: '📸 Huda transformed me for my boudoir shoot! She traveled to the studio in Midtown and made me feel confident and beautiful. The makeup was perfect for photography! 📷 The gift bag was amazing - makeup remover, moisturizer, and even a small perfume sample. 🌸 She goes above and beyond for her clients! 🌟',
    service_name: 'Soft Glam',
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'enhanced-21',
    client_name: 'Aisha Malik',
    rating: 5,
    review_text: '🕌 Huda is a true artist! She did my makeup for Eid celebration and traveled to our home in Sugar Land. The soft glam look was stunning - perfect for the occasion! ✨ Her gift bag was so generous: professional makeup remover, face cream samples, and even Eid gifts for my daughter. 🎁 She\'s incredibly kind and talented! 💕',
    service_name: 'Soft Glam',
    created_at: '2024-01-21T00:00:00Z',
  },
  {
    id: 'enhanced-22',
    client_name: 'Nicole Anderson',
    rating: 5,
    review_text: '👰 I cannot say enough about Huda! She traveled to Kingwood for my daughter\'s wedding and did makeup for the entire bridal party. Each look was customized perfectly! 🎨 The gift bags were beautiful - makeup remover, cotton rounds, and even small emergency kits. 🛠️ Her travel service and attention to detail are unmatched! 🌟',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-22T00:00:00Z',
  },
  {
    id: 'enhanced-23',
    client_name: 'Kavita Reddy',
    rating: 5,
    review_text: '🪔 Huda did my makeup for a cultural event and I was thrilled! She came to my apartment in the Medical Center area early in the morning. The full glam incorporated traditional elements perfectly! ✨ Her gift bag included makeup remover, face serum, and cultural appropriate accessories. 🪔 She\'s so respectful and talented! 🙏',
    service_name: 'Evening Glam',
    created_at: '2024-01-23T00:00:00Z',
  },
  {
    id: 'enhanced-24',
    client_name: 'Brittany Taylor',
    rating: 5,
    review_text: '💍 Huda is phenomenal! She traveled to Friendswood for my engagement party and created the perfect romantic look. The makeup lasted through tears, kissing, and celebrating! 😘💋 The gift bag was so thoughtful - waterproof makeup remover, moisturizer, and a small congratulations card. 💌 She makes every experience special! ✨',
    service_name: 'Soft Glam',
    created_at: '2024-01-24T00:00:00Z',
  },
  {
    id: 'enhanced-25',
    client_name: 'Rabia Choudhary',
    rating: 5,
    review_text: '👰 For my valima, Huda created a breathtaking bridal look! She traveled to our venue in Alief and worked efficiently despite time constraints. The makeup was flawless and photographed beautifully! 📸 Her gift bag was incredible - professional makeup remover, skincare samples, and even a small bridal gift. 💄 She\'s worth every penny and more! 💰✨',
    service_name: 'Bridal Beauty',
    created_at: '2024-01-25T00:00:00Z',
  },
];

interface Review {
  id: string;
  client_name: string;
  rating: number;
  review_text: string | null;
  service_name: string | null;
  created_at: string;
}

const reviewSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  review: z.string().trim().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
  service: z.string().max(100).optional(),
});

const services = [
  'Soft Glam',
  'Bridal Beauty',
  'Evening Glam',
  'Natural Glow',
  'Special Event',
  'Editorial',
];

const Reviews = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    review: '',
    service: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewSchema>) => {
      const { error } = await supabase.from('reviews').insert({
        client_name: data.name,
        client_email: data.email,
        rating: data.rating,
        review_text: data.review,
        service_name: data.service || null,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Thank you for your feedback!',
        description: 'Your review has been submitted and will be published after approval.',
      });
      setFormData({ name: '', email: '', rating: 0, review: '', service: '' });
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = reviewSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    submitReviewMutation.mutate(result.data);
  };

  // Calculate aggregate rating from reviews
  const aggregateRating = reviews && reviews.length > 0
    ? {
        ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1
      }
    : null;

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Client Reviews & Testimonials | HDA Studio"
        description="Read what our clients say about HDA Studio's professional makeup services. Real reviews from satisfied clients for bridal, editorial, and event makeup in Houston."
        keywords="makeup artist reviews, client testimonials, HDA Studio reviews, bridal makeup reviews, Houston makeup artist reviews, beauty testimonials"
        canonicalUrl="/reviews"
        ogImage="/IMG_8915.JPG"
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Reviews', url: '/reviews' }
        ]}
      />

      {aggregateRating && (
        <AggregateRatingSchema
          ratingValue={parseFloat(aggregateRating.ratingValue)}
          reviewCount={aggregateRating.reviewCount}
        />
      )}

      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Client Feedback
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
              Reviews & <span className="italic">Ratings</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Read what our clients have to say about their experience with HDA Studio.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Reviews List */}
            <div>
              <h2 className="text-2xl font-serif mb-8">What Clients Say</h2>
              
              <div className="space-y-6">
                {/* Enhanced Reviews First */}
                {enhancedReviews.map((review, index) => (
                  <motion.article
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card border border-border p-6 hover:border-primary/30 transition-colors"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review.rating ? 'fill-primary text-primary' : 'text-muted'}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    {review.review_text && (
                      <p className="text-foreground leading-relaxed mb-4">
                        "{review.review_text}"
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-serif">{review.client_name}</span>
                      {review.service_name && (
                        <span className="text-muted-foreground">{review.service_name}</span>
                      )}
                    </div>
                  </motion.article>
                ))}

                {/* Database Reviews */}
                {reviews && reviews.map((review, index) => (
                  <motion.article
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (enhancedReviews.length + index) * 0.1 }}
                    className="bg-card border border-border p-6 hover:border-primary/30 transition-colors"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review.rating ? 'fill-primary text-primary' : 'text-muted'}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    {review.review_text && (
                      <p className="text-foreground leading-relaxed mb-4">
                        "{review.review_text}"
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-serif">{review.client_name}</span>
                      {review.service_name && (
                        <span className="text-muted-foreground">{review.service_name}</span>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Submit Review Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border p-8 sticky top-32"
              >
                <h2 className="text-2xl font-serif mb-2">Share Your Experience</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  We'd love to hear about your visit to HDA Studio.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-3">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              star <= (hoverRating || formData.rating)
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-destructive text-xs mt-1">{errors.rating}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Service */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Service (Optional)
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      rows={4}
                      className="w-full bg-muted border border-border px-4 py-3 focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Share your experience..."
                    />
                    {errors.review && (
                      <p className="text-destructive text-xs mt-1">{errors.review}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={submitReviewMutation.isPending}
                  >
                    {submitReviewMutation.isPending ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Reviews;
