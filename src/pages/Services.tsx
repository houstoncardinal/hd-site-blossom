import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import {
  Clock,
  Sparkles,
  Users,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarDays,
  CreditCard,
  AlertCircle,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDepositCheckout } from '@/hooks/useDepositCheckout';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  GLAM_SERVICES,
  GROUP_GLAM_INFO,
  ADDONS,
  ServiceConfig,
  AddOnService,
  formatCurrency,
} from '@/config/services';
import { BUSINESS_CONFIG } from '@/config/business';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const Services = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { initiateCheckout, isLoading: isCheckoutLoading } = useDepositCheckout();

  // Booking flow state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showGroupContact, setShowGroupContact] = useState(false);
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
        title: 'Payment Canceled',
        description: "Your booking was not completed. Feel free to try again when you're ready.",
        variant: 'destructive',
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

  // Calculate totals
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const serviceTotal = (selectedService?.price || 0) + addOnsTotal;
  const depositTotal = (selectedService?.deposit || 0) + addOnsTotal * 0.5;
  const remainingBalance = serviceTotal - depositTotal;

  const handleServiceSelect = (service: ServiceConfig) => {
    setSelectedService(service);
    setStep(2); // Go to add-ons
  };

  const toggleAddOn = (addon: AddOnService) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
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
      setStep(4); // Go to payment
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime) return;

    const result = await initiateCheckout({
      service: selectedService,
      addOns: selectedAddOns,
      customerEmail: formData.email,
      customerName: formData.name,
      customerPhone: formData.phone || undefined,
      appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
      appointmentTime: selectedTime,
      notes: formData.notes || undefined,
    });

    if (result.success) {
      toast({
        title: 'Redirecting to Payment',
        description:
          'A new tab has opened for secure payment. Complete the deposit to confirm your booking.',
      });
    } else {
      toast({
        title: 'Payment Error',
        description: result.error || 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const stepLabels = ['Select Service', 'Add-Ons', 'Date & Time', 'Pay Deposit'];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Glam Services - Professional Makeup Artistry"
        description="Professional makeup services from Basic Soft Glam to Signature Glam. Perfect for everyday elegance, special events, and red carpet occasions. Book your glam session today!"
        keywords="makeup services, soft glam, full glam, signature glam, professional makeup artist, event makeup, bridal makeup, group glam"
        canonicalUrl="/services"
        ogImage="/IMG_8900.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Services', url: '/services' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              {step === 1 ? 'Our Services' : 'Book Online'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              {step === 1 ? (
                <>
                  Glam <span className="italic">Menu</span>
                </>
              ) : (
                <>
                  Schedule Your <span className="italic">Appointment</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              {step === 1
                ? 'From natural everyday elegance to show-stopping glamour. Professional makeup artistry for every occasion.'
                : 'Secure your spot with a 50% deposit. Remaining balance due in person.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps - Show after service selection */}
      {step > 1 && (
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-2 md:gap-6">
              {stepLabels.map((label, index) => (
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
                  <span
                    className={`hidden md:block text-sm ${
                      step === index + 1 ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                  {index < stepLabels.length - 1 && <div className="w-4 md:w-12 h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {GLAM_SERVICES.map((service, index) => (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleServiceSelect(service)}
                    className="text-left bg-card border border-border hover:border-primary/30 transition-all duration-500 p-8 relative group"
                  >
                    {service.popular && (
                      <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs tracking-wider uppercase px-3 py-1 flex items-center gap-1">
                        <Sparkles size={10} />
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-serif mb-3 group-hover:text-primary transition-colors">
                        {service.name}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>

                    {/* What's Included */}
                    {service.includes && (
                      <div className="mb-6">
                        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                          Includes:
                        </p>
                        <ul className="space-y-2">
                          {service.includes.slice(0, 5).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="text-primary mt-1">•</span>
                              {item}
                            </li>
                          ))}
                          {service.includes.length > 5 && (
                            <li className="text-xs text-muted-foreground italic pl-4">
                              +{service.includes.length - 5} more included
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-end justify-between border-t border-border pt-6">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-serif text-primary">
                            {formatCurrency(service.price)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(service.originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <Clock size={14} />
                          {service.duration}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">Book Now</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* GROUP GLAM Card */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: GLAM_SERVICES.length * 0.1 }}
                  onClick={() => setShowGroupContact(true)}
                  className="md:col-span-2 text-left bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 p-8 hover:border-primary transition-all duration-300"
                >
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Users size={28} className="text-primary" />
                      <h2 className="text-2xl md:text-3xl font-serif">{GROUP_GLAM_INFO.name}</h2>
                    </div>

                    <p className="text-xs tracking-widest uppercase text-primary mb-4">
                      {GROUP_GLAM_INFO.subtitle}
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                      {GROUP_GLAM_INFO.description}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-primary font-medium">
                      <MessageCircle size={18} />
                      Contact for Custom Quote
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Add-Ons */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedService(null);
                    setSelectedAddOns([]);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm self-start"
                >
                  ← Back to Services
                </button>
                <div className="text-center flex-1">
                  <h2 className="text-xl md:text-3xl font-serif">Enhance Your Experience</h2>
                  {selectedService && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedService.name} • {formatCurrency(selectedService.price)}
                    </p>
                  )}
                </div>
                <div className="hidden md:block w-24" />
              </div>

              {/* Add-ons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {ADDONS.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <motion.button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`text-left p-6 border transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg mb-1">{addon.name}</h3>
                          <p className="text-sm text-muted-foreground">{addon.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-lg font-serif text-primary">
                            +{formatCurrency(addon.price)}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {isSelected ? <Check size={14} /> : <Plus size={14} />}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Summary & Continue */}
              <div className="bg-card border border-border p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Service</span>
                  <span>{formatCurrency(selectedService?.price || 0)}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{addon.name}</span>
                        <span>+{formatCurrency(addon.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-4 mb-6">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-serif text-primary">{formatCurrency(serviceTotal)}</span>
                </div>
                <Button onClick={() => setStep(3)} className="w-full" variant="hero">
                  Continue to Date & Time
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-3 text-muted-foreground hover:text-foreground text-sm py-2 transition-colors"
                >
                  Skip add-ons
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <button
                  onClick={() => setStep(2)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm self-start"
                >
                  ← Back to Add-Ons
                </button>
                <div className="text-center flex-1">
                  <h2 className="text-xl md:text-3xl font-serif">Choose Date & Time</h2>
                  {selectedService && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedService.name}
                      {selectedAddOns.length > 0 && ` + ${selectedAddOns.length} add-on(s)`}
                      {' • '}
                      {formatCurrency(serviceTotal)}
                    </p>
                  )}
                </div>
                <div className="hidden md:block w-24" />
              </div>

              {/* Calendar */}
              <div className="bg-card border border-border p-4 md:p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="font-serif text-base md:text-lg">{format(weekStart, 'MMMM yyyy')}</h3>
                  <button
                    onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-muted-foreground uppercase tracking-wider py-2"
                    >
                      {day.slice(0, 1)}
                      <span className="hidden md:inline">{day.slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {weekDays.map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isPast = isPastDate(date);
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        disabled={isPast}
                        className={`p-3 md:p-4 text-center transition-all duration-200 rounded-lg ${
                          isPast
                            ? 'opacity-30 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        } ${isToday && !isSelected ? 'ring-1 ring-primary' : ''}`}
                      >
                        <span className="text-sm md:text-lg font-medium">{format(date, 'd')}</span>
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
                  className="bg-card border border-border p-4 md:p-6 rounded-lg"
                >
                  <h3 className="font-serif text-base md:text-lg mb-4 flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary" />
                    <span className="truncate">
                      Available Times for {format(selectedDate, 'EEE, MMM d')}
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`py-3 px-2 text-sm transition-all duration-200 rounded-lg ${
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

          {/* Step 4: Contact Details & Payment */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <button
                onClick={() => setStep(3)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
              >
                ← Back to Calendar
              </button>

              <div className="bg-card border border-border p-6 md:p-8 rounded-lg">
                <h2 className="text-xl md:text-2xl font-serif mb-2">Complete Your Booking</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Enter your details and pay your deposit to confirm.
                </p>

                {/* Booking Summary */}
                <div className="bg-muted p-4 mb-6 rounded-lg">
                  <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
                    Booking Summary
                  </h4>
                  <p className="font-serif text-lg">{selectedService?.name}</p>
                  {selectedAddOns.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      + {selectedAddOns.map((a) => a.name).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-primary/5 border border-primary/20 p-4 mb-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={18} className="text-primary" />
                    <h4 className="font-medium">Payment Breakdown</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedService?.name}</span>
                      <span>{formatCurrency(selectedService?.price || 0)}</span>
                    </div>
                    {selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between text-muted-foreground">
                        <span>{addon.name}</span>
                        <span>+{formatCurrency(addon.price)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(serviceTotal)}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between text-primary font-medium">
                        <span>50% Deposit (Due Now)</span>
                        <span>{formatCurrency(depositTotal)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Remaining Balance (In Person)</span>
                      <span>{formatCurrency(remainingBalance)}</span>
                    </div>
                  </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mb-6">
                  <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm">
                    <p className="font-medium text-amber-500 mb-1">Deposit Policy</p>
                    <p className="text-muted-foreground">
                      A 50% deposit is required to secure your booking. Deposits are non-refundable
                      for cancellations within 24 hours.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 bg-muted border border-border px-4 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full h-20 bg-muted border border-border px-4 py-3 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Allergies, preferences..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isCheckoutLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  >
                    {isCheckoutLoading ? (
                      'Processing...'
                    ) : (
                      <>
                        <CreditCard size={18} className="mr-2" />
                        Pay {formatCurrency(depositTotal)} Deposit
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Group Contact Modal */}
          <AnimatePresence>
            {showGroupContact && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={() => setShowGroupContact(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card border border-border p-8 max-w-md w-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Users size={24} className="text-primary" />
                    <h3 className="font-serif text-2xl">{GROUP_GLAM_INFO.name}</h3>
                  </div>

                  <p className="text-xs tracking-widest uppercase text-primary mb-4">
                    {GROUP_GLAM_INFO.subtitle}
                  </p>

                  <p className="text-muted-foreground mb-6">{GROUP_GLAM_INFO.description}</p>

                  <div className="space-y-3">
                    <a
                      href={`sms:${BUSINESS_CONFIG.contact.phone.raw}`}
                      className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 px-6 hover:bg-primary/90 transition-colors"
                    >
                      <MessageCircle size={18} />
                      Text Us
                    </a>

                    <a
                      href={`mailto:${BUSINESS_CONFIG.contact.email.primary}?subject=Group Glam Inquiry`}
                      className="flex items-center justify-center gap-2 w-full border border-primary text-primary py-3 px-6 hover:bg-primary/10 transition-colors"
                    >
                      <Mail size={18} />
                      Email Us
                    </a>
                  </div>

                  <button
                    onClick={() => setShowGroupContact(false)}
                    className="w-full mt-4 text-muted-foreground hover:text-foreground text-sm py-2 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
