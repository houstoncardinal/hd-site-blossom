/**
 * Comprehensive Info Widget
 * Bottom-right floating widget with complete business information
 * Services, pricing, contact, hours, and quick booking access
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Sparkles,
  Star,
  Crown,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG, getWhatsAppLink, isCurrentlyOpen } from '@/config/business';

const services = [
  {
    id: 'basic-soft-glam',
    name: 'Basic Soft Glam',
    price: '$90',
    duration: '45 min',
    icon: Sparkles,
    color: 'text-emerald-500',
  },
  {
    id: 'soft-glam',
    name: 'Soft Glam',
    price: '$108',
    duration: '60 min',
    icon: Sparkles,
    color: 'text-blue-500',
  },
  {
    id: 'standard-glam',
    name: 'Standard Glam',
    price: '$144',
    duration: '75 min',
    icon: Star,
    color: 'text-purple-500',
    popular: true,
  },
  {
    id: 'signature-glam',
    name: 'Signature Glam',
    price: '$180',
    duration: '90 min',
    icon: Crown,
    color: 'text-gold',
  },
];

const addOns = [
  { name: 'Ombre Lips', price: '$18' },
  { name: 'Winged Eyeliner', price: '$18' },
  { name: 'Scarf Setting', price: '$12-18' },
  { name: 'Highlighter Upgrade', price: '$12' },
  { name: 'Contour Upgrade', price: '$12' },
  { name: 'Jewelry Setting', price: '$12-24' },
];

const InfoWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'contact' | 'hours'>('services');
  const [showPulse, setShowPulse] = useState(true);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowPulse(false);
  };

  const tabs = [
    { id: 'services' as const, label: 'Services', icon: Sparkles },
    { id: 'contact' as const, label: 'Contact', icon: Phone },
    { id: 'hours' as const, label: 'Hours', icon: Clock },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleWidget}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className={`
          fixed bottom-6 right-6 z-[100]
          w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          shadow-xl shadow-primary/30
          flex items-center justify-center
          hover:scale-110 active:scale-95 transition-transform duration-300
          ${isOpen ? 'rotate-90' : ''}
        `}
        aria-label="Toggle info widget"
      >
        {showPulse && !isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        )}

        {isOpen ? <X size={20} /> : <Info size={20} />}
      </motion.button>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={toggleWidget}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-4 sm:right-6 z-[95] w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] sm:max-h-[600px] overflow-hidden"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg font-medium">
                      {BUSINESS_CONFIG.name.full}
                    </h3>
                    <button
                      onClick={toggleWidget}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Luxury Makeup Artistry & Beauty Services
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-4 py-3
                          text-sm font-medium transition-all duration-300
                          ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                          }
                        `}
                      >
                        <Icon size={14} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[50vh] sm:max-h-[400px] custom-scrollbar">
                  {/* Services Tab */}
                  {activeTab === 'services' && (
                    <div className="p-6 space-y-6">
                      {/* Main Services */}
                      <div>
                        <h4 className="text-xs tracking-widest uppercase text-primary mb-4 font-semibold">
                          Our Services
                        </h4>
                        <div className="space-y-3">
                          {services.map((service) => {
                            const Icon = service.icon;
                            return (
                              <div
                                key={service.id}
                                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`${service.color}`}>
                                    <Icon size={18} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm">
                                        {service.name}
                                      </p>
                                      {service.popular && (
                                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                          <Star size={8} fill="currentColor" />
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {service.duration}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-serif text-primary font-semibold">
                                  {service.price}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div>
                        <h4 className="text-xs tracking-widest uppercase text-primary mb-4 font-semibold">
                          Add-Ons
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {addOns.map((addon, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-background rounded border border-border"
                            >
                              <p className="text-xs">{addon.name}</p>
                              <p className="text-xs font-semibold text-primary">
                                {addon.price}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact CTA */}
                      <Link to="/#contact" onClick={toggleWidget}>
                        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2 font-medium">
                          <MessageCircle size={16} />
                          Contact Us
                          <ChevronRight size={16} />
                        </button>
                      </Link>

                      <Link
                        to="/services"
                        onClick={toggleWidget}
                        className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        View Full Service Menu →
                      </Link>
                    </div>
                  )}

                  {/* Contact Tab */}
                  {activeTab === 'contact' && (
                    <div className="p-6 space-y-4">
                      {/* Phone */}
                      <a
                        href={`tel:${BUSINESS_CONFIG.contact.phone.raw}`}
                        className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <Phone size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Phone</p>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {BUSINESS_CONFIG.contact.phone.display}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-muted-foreground group-hover:text-primary mt-3"
                        />
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div className="bg-green-500/10 text-green-500 p-2 rounded-lg">
                          <MessageCircle size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            Message Us
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-muted-foreground group-hover:text-primary mt-3"
                        />
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${BUSINESS_CONFIG.contact.email.primary}`}
                        className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <Mail size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors break-all">
                            {BUSINESS_CONFIG.contact.email.primary}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-muted-foreground group-hover:text-primary mt-3"
                        />
                      </a>

                      {/* Address */}
                      <a
                        href={BUSINESS_CONFIG.contact.address.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <MapPin size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {BUSINESS_CONFIG.contact.address.street}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {BUSINESS_CONFIG.contact.address.city},{' '}
                            {BUSINESS_CONFIG.contact.address.state}{' '}
                            {BUSINESS_CONFIG.contact.address.zip}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-muted-foreground group-hover:text-primary mt-3"
                        />
                      </a>

                      {/* Social Media */}
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3">Follow Us</p>
                        <div className="flex items-center gap-3">
                          {BUSINESS_CONFIG.social.instagram.enabled && (
                            <a
                              href={BUSINESS_CONFIG.social.instagram.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 p-2 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <Instagram size={16} />
                              <span className="text-xs font-medium">Instagram</span>
                            </a>
                          )}
                          {BUSINESS_CONFIG.social.facebook.enabled && (
                            <a
                              href={BUSINESS_CONFIG.social.facebook.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <Facebook size={16} />
                              <span className="text-xs font-medium">Facebook</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hours Tab */}
                  {activeTab === 'hours' && (
                    <div className="p-6 space-y-4">
                      {/* Current Status */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Status</p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isCurrentlyOpen()
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            />
                            <p className="text-sm font-semibold">
                              {isCurrentlyOpen() ? 'Open Now' : 'Closed'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pacific Time
                        </p>
                      </div>

                      {/* Hours List */}
                      <div className="space-y-2">
                        {Object.entries(BUSINESS_CONFIG.hours.regular).map(([day, hours]) => {
                          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;

                          return (
                            <div
                              key={day}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                                isToday
                                  ? 'bg-primary/10 border border-primary/30'
                                  : 'bg-background border border-border'
                              }`}
                            >
                              <p className={`text-sm capitalize font-medium ${isToday ? 'text-primary' : ''}`}>
                                {day}
                              </p>
                              <p className={`text-sm ${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                                {hours.isOpen
                                  ? `${hours.open} - ${hours.close}`
                                  : 'Closed'}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Note */}
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground italic">
                          * Walk-ins welcome, but appointments are recommended to ensure availability.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </>
  );
};

export default InfoWidget;
