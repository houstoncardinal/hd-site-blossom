/**
 * Vertical Guided Navigation
 * A step-by-step navigation that guides users through the website sections
 * Appears on the right side of the screen and highlights current section
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sparkles, Image, Star, Users, HelpCircle } from 'lucide-react';

interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  href: string;
}

const sections: NavSection[] = [
  {
    id: 'hero',
    label: 'Welcome',
    icon: Home,
    description: 'Discover luxury beauty',
    href: '#',
  },
  {
    id: 'services',
    label: 'Services',
    icon: Sparkles,
    description: 'Explore our glam options',
    href: '#services',
  },
  {
    id: 'about',
    label: 'About',
    icon: Star,
    description: 'Meet our studio',
    href: '#about',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: Image,
    description: 'View transformations',
    href: '#gallery',
  },
  {
    id: 'testimonials',
    label: 'Reviews',
    icon: Users,
    description: 'Client testimonials',
    href: '#testimonials',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: HelpCircle,
    description: 'Get in touch',
    href: '#contact',
  },
];

const VerticalGuidedNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show initial pulse animation after 2 seconds if user hasn't interacted
    const pulseTimer = setTimeout(() => {
      if (!hasInteracted) {
        // Pulse effect will be handled by CSS animation
      }
    }, 2000);

    return () => clearTimeout(pulseTimer);
  }, [hasInteracted]);

  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      });

      // Show/hide based on scroll position
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string, id: string) => {
    setHasInteracted(true);

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offsetTop = element.offsetTop - 80; // Account for navbar
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
  };

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const progress = ((currentIndex + 1) / sections.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden xl:block"
        >
          {/* Container */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border">
              <motion.div
                className="absolute left-0 top-0 w-full bg-primary"
                initial={{ height: '0%' }}
                animate={{ height: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Navigation Items */}
            <div className="pl-6 space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;
                const isPast = index < currentIndex;

                return (
                  <motion.div
                    key={section.id}
                    className="relative"
                    onMouseEnter={() => setShowTooltip(section.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Navigation Dot */}
                    <button
                      onClick={() => scrollToSection(section.href, section.id)}
                      className={`
                        group relative flex items-center justify-center
                        w-10 h-10 rounded-full border-2 transition-all duration-300
                        ${isActive
                          ? 'bg-primary border-primary scale-110 shadow-lg shadow-primary/30'
                          : isPast
                          ? 'bg-primary/20 border-primary/40 hover:bg-primary/30'
                          : 'bg-background border-border hover:border-primary/50'
                        }
                      `}
                      aria-label={section.label}
                    >
                      <Icon
                        size={16}
                        className={`
                          transition-colors duration-300
                          ${isActive
                            ? 'text-primary-foreground'
                            : isPast
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary'
                          }
                        `}
                      />

                      {/* Pulse animation for active section */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary"
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          }}
                        />
                      )}
                    </button>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {showTooltip === section.id && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-full top-1/2 -translate-y-1/2 mr-4 pointer-events-none"
                        >
                          <div className="bg-card border border-border rounded-lg shadow-xl px-4 py-3 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={14} className="text-primary" />
                              <p className="font-serif text-sm font-medium">
                                {section.label}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                          {/* Arrow */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-border" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pl-6"
            >
              <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm">
                <p className="text-xs font-medium text-center">
                  <span className="text-primary">{currentIndex + 1}</span>
                  <span className="text-muted-foreground"> / {sections.length}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerticalGuidedNav;
