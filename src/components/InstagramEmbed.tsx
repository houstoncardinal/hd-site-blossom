import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useEffect } from 'react';
import { BUSINESS_CONFIG } from '@/config/business';

/**
 * Instagram Embed Component
 * Displays embedded Instagram posts using Instagram's oEmbed API
 * Shows recent posts from your Instagram account
 */
const InstagramEmbed = () => {
  useEffect(() => {
    // Load Instagram embed script
    const loadInstagramEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    };

    loadInstagramEmbed();
  }, []);

  // Sample Instagram post URLs - Replace these with your actual Instagram post URLs
  const instagramPosts = [
    'https://www.instagram.com/p/SAMPLE_POST_1/', // Replace with actual post URL
    'https://www.instagram.com/p/SAMPLE_POST_2/', // Replace with actual post URL
    'https://www.instagram.com/p/SAMPLE_POST_3/', // Replace with actual post URL
  ];

  return (
    <section className="py-16 md:py-20 bg-charcoal-light">
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
            <Instagram size={20} className="text-primary" />
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
              {BUSINESS_CONFIG.social.instagram.handle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Latest on <span className="italic">Instagram</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Follow us for daily makeup inspiration, behind-the-scenes content, and beauty tips
          </p>
        </motion.div>

        {/* Instagram Embeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {instagramPosts.map((postUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-lg"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={postUrl}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '3px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '1px',
                  maxWidth: '540px',
                  minWidth: '326px',
                  padding: 0,
                  width: '99.375%',
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a
                    href={postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View this post on Instagram
                  </a>
                </div>
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={BUSINESS_CONFIG.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg"
          >
            <Instagram size={20} />
            <span>Follow {BUSINESS_CONFIG.social.instagram.handle}</span>
          </a>

          <p className="text-muted-foreground text-sm mt-4">
            Join our community of beauty enthusiasts
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Extend Window interface for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramEmbed;
