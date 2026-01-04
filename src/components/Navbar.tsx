import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Team', href: '/team' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Booking', href: '/booking' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-serif tracking-wider text-foreground">
            HDA <span className="text-primary">Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Book Now Button */}
          <div className="hidden md:block">
            <Link to="/booking">
              <Button variant="hero" size="lg">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pt-6 pb-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 py-2 ${
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                <Button variant="hero" size="lg" className="mt-4 w-full">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Navbar;
