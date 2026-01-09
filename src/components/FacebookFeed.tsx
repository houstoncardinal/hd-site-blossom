import { motion } from 'framer-motion';
import { Facebook } from 'lucide-react';
import { useEffect } from 'react';
import { BUSINESS_CONFIG } from '@/config/business';

/**
 * Facebook Page Plugin Component
 * Displays the official Facebook page feed using Facebook's SDK
 */
const FacebookFeed = () => {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      // Check if SDK is already loaded
      if (window.FB) {
        window.FB.XFBML.parse();
        return;
      }

      // Create SDK script
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';

      // Initialize SDK when loaded
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            xfbml: true,
            version: 'v18.0'
          });
        }
      };

      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  // Extract page name from Facebook URL
  const facebookPageUrl = BUSINESS_CONFIG.social.facebook.url;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Facebook size={20} className="text-primary" />
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
              {BUSINESS_CONFIG.social.facebook.handle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Follow Us on <span className="italic">Facebook</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Stay connected with our latest work, client transformations, and beauty tips
          </p>
        </motion.div>

        {/* Facebook Page Plugin */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            <div id="fb-root"></div>
            <div className="relative min-h-[500px] flex items-center justify-center">
              <div
                className="fb-page w-full"
                data-href={facebookPageUrl}
                data-tabs="timeline"
                data-width="500"
                data-height="500"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              >
                {/* Fallback content while loading */}
                <blockquote cite={facebookPageUrl} className="fb-xfbml-parse-ignore p-8 text-center">
                  <a href={facebookPageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visit {BUSINESS_CONFIG.social.facebook.handle} on Facebook
                  </a>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <div className="text-center mt-8">
            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors duration-300 font-medium"
            >
              <Facebook size={20} />
              <span>Follow on Facebook</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    FB?: {
      init: (params: { xfbml: boolean; version: string }) => void;
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export default FacebookFeed;
