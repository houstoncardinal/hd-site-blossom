import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, getPhoneTel, getWhatsAppLink } from '@/config/business';

const ContactButtons = () => {
  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col gap-3">
      {/* Phone button */}
      <motion.a
        href={`tel:${getPhoneTel()}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
        aria-label={`Call ${BUSINESS_CONFIG.contact.phone.display}`}
        title={`Call us: ${BUSINESS_CONFIG.contact.phone.display}`}
      >
        <Phone size={24} className="group-hover:animate-pulse" />
      </motion.a>

      {/* WhatsApp button */}
      <motion.a
        href={getWhatsAppLink('Hi! I would like to book an appointment at HDA Studio.')}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
        aria-label="Chat on WhatsApp"
        title="Message us on WhatsApp"
      >
        <MessageCircle size={24} className="group-hover:animate-pulse" />
      </motion.a>
    </div>
  );
};

export default ContactButtons;
