import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Check, CalendarDays, CreditCard, AlertCircle, Sparkles, Scissors, MapPin, ChevronDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDepositCheckout } from '@/hooks/useDepositCheckout';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllServices, ADDONS, ServiceConfig, AddOnService, formatCurrency } from '@/config/services';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

// Compact add-on item component
const AddOnItem = ({ 
  addon, 
  isSelected, 
  onToggle 
}: { 
  addon: AddOnService; 
  isSelected: boolean; 
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
      isSelected
        ? 'border-primary bg-primary/10'
        : 'border-border hover:border-primary/50 bg-card'
    }`}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'
    }`}>
      {isSelected && <Check size={10} className="text-primary-foreground" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{addon.name}</span>
        <span className="text-sm font-semibold text-primary flex-shrink-0">
          +{formatCurrency(addon.price)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{addon.description}</p>
    </div>
  </button>
);

const Booking = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { initiateCheckout, isLoading: isCheckoutLoading } = useDepositCheckout();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const allServices = getAllServices();

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

  // Calculate totals with add-ons
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const serviceTotal = (selectedService?.price || 0) + addOnsTotal;
  const depositTotal = (selectedService?.deposit || 0) + (addOnsTotal * 0.5);
  const remainingBalance = serviceTotal - depositTotal;

  const handleServiceSelect = (service: ServiceConfig) => {
    setSelectedService(service);
    setSelectedAddOns([]);
    setStep(2);
  };

  const handleAddOnToggle = (addon: AddOnService) => {
    setSelectedAddOns(prev => {
      const isSelected = prev.some(a => a.id === addon.id);
      if (isSelected) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
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

  // Group add-ons by category
  const makeupAddOns = ADDONS.filter(a => a.category === 'makeup');
  const hairAddOns = ADDONS.filter(a => a.category === 'hair');
  const generalAddOns = ADDONS.filter(a => a.category === 'general');

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
      <section className="py-8 md:py-16 pb-32 lg:pb-16">
        <div className="container mx-auto px-4 md:px-6">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                {allServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`group text-left bg-card border transition-all duration-300 hover:border-primary/50 rounded-lg overflow-hidden ${
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
                    <div className="p-3 md:p-4">
                      <h3 className="font-serif text-sm md:text-lg mb-1 line-clamp-1">{service.name}</h3>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm mb-2 gap-1">
                        <div>
                          <span className="text-muted-foreground line-through text-xs mr-1">
                            {formatCurrency(service.originalPrice)}
                          </span>
                          <span className="text-primary font-semibold">{formatCurrency(service.price)}</span>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock size={10} />
                          {service.duration}
                        </span>
                      </div>
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

          {/* Step 2: Select Date, Time & Add-ons */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm self-start"
                >
                  ← Back to Services
                </button>
                <div className="text-center flex-1">
                  <h2 className="text-xl md:text-3xl font-serif">Customize Your Booking</h2>
                  {selectedService && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedService.name} - {formatCurrency(selectedService.price)}
                    </p>
                  )}
                </div>
                <div className="hidden md:block w-24" />
              </div>

              {/* Main Content Grid */}
              <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6">
                {/* Left Column: Calendar & Time (takes 3 cols on lg) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Calendar */}
                  <div className="bg-card border border-border p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                        className="p-2 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h3 className="font-serif text-base md:text-lg">
                        {format(weekStart, 'MMMM yyyy')}
                      </h3>
                      <button
                        onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                        className="p-2 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-center text-xs text-muted-foreground uppercase tracking-wider py-2">
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
                            className={`p-2 md:p-4 text-center transition-all duration-200 rounded-lg ${
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
                        <span className="truncate">Times for {format(selectedDate, 'EEE, MMM d')}</span>
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;

                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`py-2.5 px-2 text-xs md:text-sm transition-all duration-200 rounded-lg ${
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
                </div>

                {/* Right Column: Add-ons (takes 2 cols on lg) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Add-ons Section */}
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-serif text-lg flex items-center gap-2">
                        <ShoppingBag size={18} className="text-primary" />
                        Enhance Your Look
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">Optional add-ons (50% deposit applies)</p>
                    </div>

                    <Accordion type="multiple" defaultValue={["makeup"]} className="w-full">
                      {/* Makeup Add-ons */}
                      <AccordionItem value="makeup" className="border-b border-border">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Sparkles size={14} className="text-primary" />
                            Makeup Enhancements
                            <span className="text-xs text-muted-foreground ml-1">({makeupAddOns.length})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="space-y-2">
                            {makeupAddOns.map((addon) => (
                              <AddOnItem
                                key={addon.id}
                                addon={addon}
                                isSelected={selectedAddOns.some(a => a.id === addon.id)}
                                onToggle={() => handleAddOnToggle(addon)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Hair Add-ons */}
                      <AccordionItem value="hair" className="border-b border-border">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Scissors size={14} className="text-primary" />
                            Hair Enhancements
                            <span className="text-xs text-muted-foreground ml-1">({hairAddOns.length})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="space-y-2">
                            {hairAddOns.map((addon) => (
                              <AddOnItem
                                key={addon.id}
                                addon={addon}
                                isSelected={selectedAddOns.some(a => a.id === addon.id)}
                                onToggle={() => handleAddOnToggle(addon)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* General Add-ons */}
                      <AccordionItem value="general" className="border-0">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <MapPin size={14} className="text-primary" />
                            Travel & Extras
                            <span className="text-xs text-muted-foreground ml-1">({generalAddOns.length})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="space-y-2">
                            {generalAddOns.map((addon) => (
                              <AddOnItem
                                key={addon.id}
                                addon={addon}
                                isSelected={selectedAddOns.some(a => a.id === addon.id)}
                                onToggle={() => handleAddOnToggle(addon)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Desktop Running Total */}
                  <div className="hidden lg:block bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-primary" />
                      Your Selection
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="truncate pr-2">{selectedService?.name}</span>
                        <span className="flex-shrink-0">{formatCurrency(selectedService?.price || 0)}</span>
                      </div>
                      {selectedAddOns.map(addon => (
                        <div key={addon.id} className="flex justify-between text-muted-foreground">
                          <span className="truncate pr-2">+ {addon.name}</span>
                          <span className="flex-shrink-0">{formatCurrency(addon.price)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-2 mt-2 space-y-1">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(serviceTotal)}</span>
                        </div>
                        <div className="flex justify-between text-primary font-semibold">
                          <span>Deposit (50%)</span>
                          <span>{formatCurrency(depositTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Summary Bar */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <button
                      onClick={() => setShowMobileSummary(!showMobileSummary)}
                      className="flex items-center gap-2 text-left w-full"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {selectedAddOns.length > 0 ? `${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? 's' : ''} selected` : 'No add-ons'}
                        </p>
                        <p className="font-semibold text-primary">{formatCurrency(depositTotal)} deposit</p>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-muted-foreground transition-transform ${showMobileSummary ? 'rotate-180' : ''}`} 
                      />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatCurrency(serviceTotal)}</p>
                  </div>
                </div>

                {/* Expandable Summary */}
                <AnimatePresence>
                  {showMobileSummary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{selectedService?.name}</span>
                          <span>{formatCurrency(selectedService?.price || 0)}</span>
                        </div>
                        {selectedAddOns.map(addon => (
                          <div key={addon.id} className="flex justify-between text-muted-foreground">
                            <span>+ {addon.name}</span>
                            <span>{formatCurrency(addon.price)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-muted-foreground pt-2 border-t border-border">
                          <span>Remaining (due in person)</span>
                          <span>{formatCurrency(remainingBalance)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                      + {selectedAddOns.map(a => a.name).join(', ')}
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
                    {selectedAddOns.map(addon => (
                      <div key={addon.id} className="flex justify-between text-muted-foreground">
                        <span>+ {addon.name}</span>
                        <span>{formatCurrency(addon.price)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>Service Total</span>
                        <span>{formatCurrency(serviceTotal)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-primary font-medium">
                      <span>50% Deposit (Due Now)</span>
                      <span>{formatCurrency(depositTotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground border-t border-border pt-2 mt-2">
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
                    <label className="text-sm text-muted-foreground block mb-2">
                      Full Name *
                    </label>
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
                    <label className="text-sm text-muted-foreground block mb-2">
                      Phone Number
                    </label>
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Booking;
