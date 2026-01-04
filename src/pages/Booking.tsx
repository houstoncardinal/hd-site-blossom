import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Check, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useBookAppointment } from '@/hooks/useBookAppointment';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';

const services = [
  { id: 'soft-glam', name: 'Soft Glam', price: 100, duration: '60 min', image: softGlamImage },
  { id: 'bridal', name: 'Bridal Beauty', price: 250, duration: '120 min', image: bridalImage },
  { id: 'evening-glam', name: 'Evening Glam', price: 150, duration: '90 min', image: glamImage },
  { id: 'natural-glow', name: 'Natural Glow', price: 80, duration: '45 min', image: naturalImage },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const Booking = () => {
  const { toast } = useToast();
  const bookAppointment = useBookAppointment();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const isPastDate = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
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
    
    const selectedServiceData = services.find(s => s.id === selectedService);
    if (!selectedServiceData || !selectedDate || !selectedTime) return;

    try {
      await bookAppointment.mutateAsync({
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        serviceName: selectedServiceData.name,
        servicePrice: selectedServiceData.price,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedTime,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your appointment has been scheduled. A confirmation email has been sent to ${formData.email}.`,
      });

      setStep(4);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
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
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {['Select Service', 'Choose Date & Time', 'Your Details', 'Confirmation'].map((label, index) => (
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
                {index < 3 && <div className="w-8 md:w-16 h-px bg-border" />}
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
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`group text-left bg-card border transition-all duration-300 hover:border-primary/50 ${
                      selectedService === service.id ? 'border-primary' : 'border-border'
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary">${service.price}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {service.duration}
                        </span>
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
                  {selectedServiceData && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedServiceData.name} - ${selectedServiceData.price}
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

          {/* Step 3: Contact Details */}
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
                <h2 className="text-2xl font-serif mb-2">Your Details</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Almost there! Please provide your contact information.
                </p>

                {/* Booking Summary */}
                <div className="bg-muted p-4 mb-8">
                  <h4 className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                    Booking Summary
                  </h4>
                  <p className="font-serif text-lg">{selectedServiceData?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </p>
                  <p className="text-primary mt-2">${selectedServiceData?.price}</p>
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
                    disabled={bookAppointment.isPending}
                  >
                    {bookAppointment.isPending ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={40} className="text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground mb-8">
                Thank you for booking with HDA Studio. We've sent a confirmation 
                email to {formData.email} with all the details.
              </p>

              <div className="bg-card border border-border p-6 mb-8 text-left">
                <h4 className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                  Appointment Details
                </h4>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Service:</span> {selectedServiceData?.name}</p>
                  <p><span className="text-muted-foreground">Date:</span> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  <p><span className="text-muted-foreground">Time:</span> {selectedTime}</p>
                  <p><span className="text-muted-foreground">Duration:</span> {selectedServiceData?.duration}</p>
                  <p className="text-primary font-medium pt-2 border-t border-border mt-4">
                    Total: ${selectedServiceData?.price}
                  </p>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({ name: '', email: '', phone: '', notes: '' });
                }}
              >
                Book Another Appointment
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Booking;
