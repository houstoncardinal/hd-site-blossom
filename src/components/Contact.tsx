import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    try {
      const { error } = await supabase.from('form_submissions').insert({
        form_type: 'contact',
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        message: message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">
              Contact <span className="italic">Us</span>
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-12">
              Ready to experience luxury beauty? Reach out to learn more about our services. 
              We'd love to help you look and feel your absolute best.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Location</h4>
                  <a
                    href={BUSINESS_CONFIG.contact.address.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {BUSINESS_CONFIG.contact.address.oneLine}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Phone</h4>
                  <a
                    href={`tel:${BUSINESS_CONFIG.contact.phone.raw}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {BUSINESS_CONFIG.contact.phone.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Email</h4>
                  <a
                    href={`mailto:${BUSINESS_CONFIG.contact.email.primary}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {BUSINESS_CONFIG.contact.email.primary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Hours</h4>
                  <p className="text-muted-foreground text-sm">{BUSINESS_CONFIG.hours.display.weekdays}</p>
                  <p className="text-muted-foreground text-sm">{BUSINESS_CONFIG.hours.display.saturday}</p>
                  <p className="text-muted-foreground text-sm">{BUSINESS_CONFIG.hours.display.sunday}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card border border-border p-8 md:p-10"
          >
            <h3 className="text-2xl font-serif mb-8">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-muted-foreground block mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="bg-muted border-border focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-muted-foreground block mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-muted border-border focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="text-sm text-muted-foreground block mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="bg-muted border-border focus:border-primary"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm text-muted-foreground block mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="bg-muted border-border focus:border-primary resize-none"
                  placeholder="Tell us about your beauty needs..."
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
