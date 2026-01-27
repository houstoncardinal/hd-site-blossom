import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FAQContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const question = formData.get('question') as string;

    try {
      // Save to database
      const { error: dbError } = await supabase.from('form_submissions').insert({
        form_type: 'faq',
        name: name.trim(),
        email: email.trim(),
        message: question.trim(),
      });

      if (dbError) throw dbError;

      // Send email notification
      try {
        await supabase.functions.invoke('send-form-notification', {
          body: {
            formType: 'faq',
            name: name.trim(),
            email: email.trim(),
            message: question.trim(),
          },
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Question Submitted!",
        description: "We'll get back to you with an answer soon.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto bg-card border border-border p-8 md:p-10"
    >
      <h3 className="text-2xl font-serif mb-2 text-center">Ask Your Question</h3>
      <p className="text-muted-foreground text-sm text-center mb-8">
        Can't find what you're looking for? Send us your question and we'll respond within 24 hours.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="faq-name" className="text-sm text-muted-foreground block mb-2">
              Name *
            </label>
            <Input
              id="faq-name"
              name="name"
              required
              className="bg-muted border-border focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="faq-email" className="text-sm text-muted-foreground block mb-2">
              Email *
            </label>
            <Input
              id="faq-email"
              name="email"
              type="email"
              required
              className="bg-muted border-border focus:border-primary"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="faq-question" className="text-sm text-muted-foreground block mb-2">
            Your Question *
          </label>
          <Textarea
            id="faq-question"
            name="question"
            required
            rows={4}
            className="bg-muted border-border focus:border-primary resize-none"
            placeholder="What would you like to know?"
          />
        </div>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </Button>
      </form>
    </motion.div>
  );
};

export default FAQContactForm;
