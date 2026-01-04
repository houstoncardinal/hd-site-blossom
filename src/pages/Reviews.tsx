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

  return (
    <main className="min-h-screen bg-background">
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
              
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-card border border-border p-6">
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} className="w-4 h-4 bg-muted rounded" />
                        ))}
                      </div>
                      <div className="h-20 bg-muted mb-4" />
                      <div className="h-4 bg-muted w-1/3" />
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
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
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border">
                  <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
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
