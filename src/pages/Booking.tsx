import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Check, CalendarDays, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDepositCheckout } from '@/hooks/useDepositCheckout';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SERVICES, ServiceConfig, formatCurrency } from '@/config/services';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const Booking = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { initiateCheckout, isLoading: isCheckoutLoading } = useDepositCheckout();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Check for canceled booking
  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your booking was not completed. Feel free to try again when you're ready.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const isPastDate = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const handleServiceSelect = (service: ServiceConfig) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      setSelectedTime(time);
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) return;

    const result = await initiateCheckout({
      service: selectedService,
      customerEmail: formData.email,
      customerName: formData.name,
      customerPhone: formData.phone || undefined,
      appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
      appointmentTime: selectedTime,
      notes: formData.notes || undefined,
    });

    if (result.success) {
      toast({
        title: "Redirecting to Payment",
        description: "A new tab has opened for secure payment. Complete the deposit to confirm your booking.",
      });
    } else {
      toast({
        title: "Payment Error",
        description: result.error || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Book Appointment - Schedule Your Glam Session"
        description="Book your luxury makeup appointment at HDA Studio. 50% deposit required to secure your booking, remaining balance due in person. Easy online booking with instant confirmation."
        keywords="book makeup appointment, schedule beauty service, makeup booking, glam session, beauty appointment, HDA Studio booking, makeup artist appointment"
        canonicalUrl="/booking"
        ogImage="/IMG_8915.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Booking', url: '/booking' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Book Online
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
              Schedule Your <span className="italic">Appointment</span>
            </h1>
            <p className="text-muted-foreground">
              Secure your spot with a 50% deposit. Remaining balance due in person.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {['Select Service', 'Choose Date & Time', 'Pay Deposit'].map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > index + 1
                      ? 'bg-primary text-primary-foreground'
                      : step === index + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > index + 1 ? <Check size={16} /> : index + 1}
                </div>
                <span className={`hidden md:block text-sm ${step === index + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {index < 2 && <div className="w-8 md:w-16 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">
                Select a Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`group text-left bg-card border transition-all duration-300 hover:border-primary/50 ${
                      selectedService?.id === service.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg mb-1">{service.name}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div>
                          <span className="text-muted-foreground line-through text-xs mr-1">
                            {formatCurrency(service.originalPrice)}
                          </span>
                          <span className="text-primary">{formatCurrency(service.price)}</span>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {service.duration}
                        </span>
                      </div>
                      {/* Deposit Info */}
                      <div className="bg-primary/10 rounded px-2 py-1 text-xs text-primary">
                        <CreditCard size={10} className="inline mr-1" />
                        {formatCurrency(service.deposit)} deposit
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  ← Back to Services
                </button>
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-serif">Choose Date & Time</h2>
                  {selectedService && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedService.name} - {formatCurrency(selectedService.price)}
                    </p>
                  )}
                </div>
                <div className="w-24" />
              </div>

              {/* Calendar */}
              <div className="bg-card border border-border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="font-serif text-lg">
                    {format(weekStart, 'MMMM yyyy')}
                  </h3>
                  <button
                    onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-xs text-muted-foreground uppercase tracking-wider py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isPast = isPastDate(date);
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        disabled={isPast}
                        className={`p-4 text-center transition-all duration-200 ${
                          isPast
                            ? 'opacity-30 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        } ${isToday && !isSelected ? 'ring-1 ring-primary' : ''}`}
                      >
                        <span className="text-lg font-medium">{format(date, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border p-6"
                >
                  <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary" />
                    Available Times for {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`py-3 px-4 text-sm transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border hover:border-primary hover:text-primary'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Contact Details & Payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <button
                onClick={() => setStep(2)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
              >
                ← Back to Calendar
              </button>

              <div className="bg-card border border-border p-8">
                <h2 className="text-2xl font-serif mb-2">Complete Your Booking</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Enter your details and pay your deposit to confirm.
                </p>

                {/* Booking Summary */}
                <div className="bg-muted p-4 mb-6">
                  <h4 className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                    Booking Summary
                  </h4>
                  <p className="font-serif text-lg">{selectedService?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-primary/5 border border-primary/20 p-4 mb-8 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={18} className="text-primary" />
                    <h4 className="font-medium">Payment Breakdown</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service Total</span>
                      <span>{formatCurrency(selectedService?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between text-primary font-medium">
                      <span>50% Deposit (Due Now)</span>
                      <span>{formatCurrency(selectedService?.deposit || 0)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground border-t border-border pt-2 mt-2">
                      <span>Remaining Balance (Due In Person)</span>
                      <span>{formatCurrency(selectedService?.remainingBalance || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded mb-8">
                  <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-500 mb-1">Deposit Policy</p>
                    <p className="text-muted-foreground">
                      A 50% deposit is required to secure your booking. The remaining balance 
                      will be collected in person at your appointment. Deposits are non-refundable 
                      for cancellations within 24 hours.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 focus:border-primary focus:outline-none transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full bg-muted border border-border px-4 py-3 focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Any specific requests or allergies..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isCheckoutLoading}
                  >
                    <CreditCard size={18} className="mr-2" />
                    {isCheckoutLoading 
                      ? 'Processing...' 
                      : `Pay ${formatCurrency(selectedService?.deposit || 0)} Deposit`
                    }
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe. You'll be redirected to complete payment.
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Booking;
