/**
 * Analytics Component
 * Handles Google Analytics 4 and Meta Pixel tracking
 * Respects cookie consent preferences
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';
import { hasAnalyticsConsent, hasMarketingConsent } from './CookieConsent';

// Extend Window interface for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const Analytics = () => {
  const location = useLocation();
  const { googleAnalytics, metaPixel } = BUSINESS_CONFIG.analytics;

  // Track page views on route change
  useEffect(() => {
    // Google Analytics page view
    if (googleAnalytics.enabled && hasAnalyticsConsent() && window.gtag) {
      window.gtag('config', googleAnalytics.measurementId, {
        page_path: location.pathname + location.search,
      });
    }

    // Meta Pixel page view
    if (metaPixel.enabled && hasMarketingConsent() && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location, googleAnalytics.enabled, googleAnalytics.measurementId, metaPixel.enabled]);

  return (
    <Helmet>
      {/* Google Analytics 4 */}
      {googleAnalytics.enabled && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.measurementId}`}
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              // Initialize with consent mode
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'functionality_storage': 'granted',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
              });

              gtag('config', '${googleAnalytics.measurementId}', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
              });
            `}
          </script>
        </>
      )}

      {/* Meta Pixel */}
      {metaPixel.enabled && (
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('consent', 'revoke');
            fbq('init', '${metaPixel.pixelId}');
          `}
        </script>
      )}
    </Helmet>
  );
};

// Helper functions for tracking events

/**
 * Track custom event in Google Analytics
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (BUSINESS_CONFIG.analytics.googleAnalytics.enabled && hasAnalyticsConsent() && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * Track booking/conversion event
 */
export const trackBooking = (serviceName: string, value: number) => {
  // Google Analytics
  if (BUSINESS_CONFIG.analytics.googleAnalytics.enabled && hasAnalyticsConsent() && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `booking_${Date.now()}`,
      value: value,
      currency: 'USD',
      items: [{
        item_name: serviceName,
        price: value,
      }],
    });
  }

  // Meta Pixel
  if (BUSINESS_CONFIG.analytics.metaPixel.enabled && hasMarketingConsent() && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'USD',
      content_name: serviceName,
    });
  }
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submission', {
    form_name: formName,
  });

  if (BUSINESS_CONFIG.analytics.metaPixel.enabled && hasMarketingConsent() && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
    });
  }
};

/**
 * Track button click
 */
export const trackClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown',
  });
};

/**
 * Track social media click
 */
export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    platform: platform,
  });
};

export default Analytics;
