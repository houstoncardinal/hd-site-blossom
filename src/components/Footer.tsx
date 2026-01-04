import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" className="text-3xl font-serif tracking-wider text-foreground block mb-4">
              HDA <span className="text-primary">Studio</span>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm mb-6">
              Luxury beauty services crafted with precision and artistry. 
              Transform your look with our expert makeup artists.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:hello@hdastudio.com"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Quick Links</h4>
            <nav className="space-y-3">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Home
              </a>
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Services
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                About
              </a>
              <a href="#gallery" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Gallery
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact
              </a>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg mb-6">Services</h4>
            <nav className="space-y-3">
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Soft Glam
              </a>
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Bridal Beauty
              </a>
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Evening Glam
              </a>
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Natural Glow
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HDA Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
