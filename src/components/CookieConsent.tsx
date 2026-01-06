import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'hda-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'hda-cookie-preferences';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent && !savedPreferences) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else if (savedPreferences) {
      // Load saved preferences
      try {
        const prefs = JSON.parse(savedPreferences);
        setPreferences(prefs);
        // Initialize tracking based on preferences
        initializeTracking(prefs);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const initializeTracking = (prefs: CookiePreferences) => {
    // Initialize Google Analytics if consent given
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
      });
    }

    // Initialize Meta Pixel if consent given
    if (prefs.marketing && window.fbq) {
      window.fbq('consent', 'grant');
    }
  };

  const acceptAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };

    saveConsent(newPreferences);
    initializeTracking(newPreferences);
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };

    saveConsent(newPreferences);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
    initializeTracking(preferences);
    setShowBanner(false);
    setShowDetails(false);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setShowDetails(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="bg-card border border-border shadow-2xl rounded-lg p-6 md:p-8">
                {!showDetails ? (
                  // Simple view
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                        <Cookie size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg md:text-xl mb-2">We Value Your Privacy</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                          By clicking "Accept All", you consent to our use of cookies. Learn more in our{' '}
                          <Link to="/privacy-policy#cookies" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(true)}
                        className="whitespace-nowrap"
                      >
                        Customize
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={acceptNecessary}
                        className="whitespace-nowrap"
                      >
                        Necessary Only
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={acceptAll}
                        className="whitespace-nowrap"
                      >
                        Accept All
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Detailed preferences view
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Cookie size={24} className="text-primary" />
                        <h3 className="font-serif text-xl md:text-2xl">Cookie Preferences</h3>
                      </div>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close preferences"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      {/* Necessary Cookies */}
                      <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold mb-1">Necessary Cookies</h4>
                          <p className="text-sm text-muted-foreground">
                            Essential for the website to function properly. These cookies enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">Always Active</span>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                          <p className="text-sm text-muted-foreground">
                            Help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={() => togglePreference('analytics')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                          <p className="text-sm text-muted-foreground">
                            Used to track visitors across websites to display relevant advertisements and encourage them to share content with their social networks.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={() => togglePreference('marketing')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={acceptNecessary}
                      >
                        Necessary Only
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={saveCustomPreferences}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper function to check if analytics consent has been granted
export const hasAnalyticsConsent = (): boolean => {
  try {
    const prefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!prefs) return false;
    const preferences: CookiePreferences = JSON.parse(prefs);
    return preferences.analytics;
  } catch {
    return false;
  }
};

// Helper function to check if marketing consent has been granted
export const hasMarketingConsent = (): boolean => {
  try {
    const prefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!prefs) return false;
    const preferences: CookiePreferences = JSON.parse(prefs);
    return preferences.marketing;
  } catch {
    return false;
  }
};

export default CookieConsent;
