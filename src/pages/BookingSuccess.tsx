import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock, DollarSign, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { formatCurrency } from '@/config/services';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [bookingDetails, setBookingDetails] = useState<{
    serviceName?: string;
    depositPaid?: number;
    remainingBalance?: number;
    customerName?: string;
    customerEmail?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  } | null>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // In a production app, you would fetch session details from Stripe
    // For now, we'll show a generic success message
    // The booking details would come from the session metadata
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Booking Confirmed - HDA Studio"
        description="Your appointment has been successfully booked at HDA Studio."
        noIndex={true}
      />

      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Check size={48} className="text-primary-foreground" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Deposit <span className="italic">Confirmed!</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for booking with HDA Studio. Your 50% deposit has been successfully processed.
            </p>

            {/* Payment Summary Card */}
            <div className="bg-card border border-border p-8 mb-8 text-left">
              <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-6">
                Payment Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-500">
                  <Check size={20} />
                  <span className="font-medium">50% Deposit Paid</span>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-start gap-3">
                    <DollarSign size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium">Remaining Balance Due</p>
                      <p className="text-muted-foreground text-sm">
                        The remaining 50% will be collected in person at your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next Card */}
            <div className="bg-charcoal-light border border-border p-8 mb-8 text-left">
              <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-6">
                What's Next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-muted-foreground text-sm">
                      We've sent a confirmation email with all the details of your appointment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Save the Date</p>
                    <p className="text-muted-foreground text-sm">
                      Add your appointment to your calendar so you don't forget!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Arrive On Time</p>
                    <p className="text-muted-foreground text-sm">
                      Please arrive 5-10 minutes early with a clean, moisturized face.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Bring Remaining Payment</p>
                    <p className="text-muted-foreground text-sm">
                      Remember to bring payment for the remaining balance (cash, card, or digital payment accepted).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-card border border-border p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Need to reschedule or have questions?</p>
              <a 
                href="tel:+18329070199" 
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Phone size={16} />
                (832) 907-0199
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="elegant" size="lg">
                  Return Home
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="hero" size="lg">
                  Browse Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BookingSuccess;
