import { motion } from 'framer-motion';
import { Instagram, Facebook, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BUSINESS_CONFIG } from '@/config/business';
import InstagramFeed from './InstagramFeed';
import { useEffect, useRef, useState } from 'react';

/**
 * Unified Social Media Feeds Component
 * Displays Instagram and Facebook feeds in a tabbed interface
 * Optimized: Defers Facebook SDK loading until component is in viewport
 */
const SocialMediaFeeds = () => {
  const [shouldLoadSDK, setShouldLoadSDK] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only load Facebook SDK when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadSDK(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadSDK) return;

    // Load Facebook SDK only when needed
    const loadFacebookSDK = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';

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

    // Delay SDK load by 100ms to prioritize main content
    const timer = setTimeout(loadFacebookSDK, 100);
    return () => clearTimeout(timer);
  }, [shouldLoadSDK]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-background via-charcoal-light to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Share2 size={20} className="text-primary" />
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
              Connect With Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Social Media <span className="italic">Feed</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
            Follow our journey, get daily beauty inspiration, and stay updated with our latest work
          </p>
        </motion.div>

        {/* Tabbed Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="instagram" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-card border border-border">
              <TabsTrigger
                value="instagram"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <Instagram size={18} />
                <span>Instagram</span>
              </TabsTrigger>
              <TabsTrigger
                value="facebook"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <Facebook size={18} />
                <span>Facebook</span>
              </TabsTrigger>
            </TabsList>

            {/* Instagram Tab */}
            <TabsContent value="instagram" className="mt-0">
              <div className="max-w-7xl mx-auto">
                <InstagramFeed />
              </div>
            </TabsContent>

            {/* Facebook Tab */}
            <TabsContent value="facebook" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl p-4">
                  <div id="fb-root"></div>
                  <div className="relative min-h-[600px] flex items-center justify-center">
                    <div
                      className="fb-page w-full"
                      data-href={BUSINESS_CONFIG.social.facebook.url}
                      data-tabs="timeline"
                      data-width="500"
                      data-height="600"
                      data-small-header="false"
                      data-adapt-container-width="true"
                      data-hide-cover="false"
                      data-show-facepile="true"
                    >
                      <blockquote cite={BUSINESS_CONFIG.social.facebook.url} className="fb-xfbml-parse-ignore p-8 text-center">
                        <a
                          href={BUSINESS_CONFIG.social.facebook.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          Visit {BUSINESS_CONFIG.social.facebook.handle} on Facebook
                        </a>
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Facebook Follow Button */}
                <div className="text-center mt-8">
                  <a
                    href={BUSINESS_CONFIG.social.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Facebook size={22} />
                    <span>Follow on Facebook</span>
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20"
        >
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-serif font-light text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Instagram Followers</div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-serif font-light text-primary mb-2">1K+</div>
            <div className="text-muted-foreground">Facebook Fans</div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-serif font-light text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Posts Per Month</div>
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

export default SocialMediaFeeds;
