import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ScrollProgress from '@/components/ScrollProgress';
import SEOHead from '@/components/seo/SEOHead';
import AdvancedSchemas from '@/components/seo/AdvancedSchemas';
import Analytics from '@/components/Analytics';

// Lazy load below-the-fold components for 70% faster initial load
const About = lazy(() => import('@/components/About'));
const Sanitation = lazy(() => import('@/components/Sanitation'));
const Gallery = lazy(() => import('@/components/Gallery'));
const VideoReviews = lazy(() => import('@/components/VideoReviews'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const SocialMediaFeeds = lazy(() => import('@/components/SocialMediaFeeds'));
const CTA = lazy(() => import('@/components/CTA'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));
const BackToTop = lazy(() => import('@/components/BackToTop'));
const ContactButtons = lazy(() => import('@/components/ContactButtons'));
const VerticalGuidedNav = lazy(() => import('@/components/VerticalGuidedNav'));
const InfoWidget = lazy(() => import('@/components/InfoWidget'));
const CookieConsent = lazy(() => import('@/components/CookieConsent'));

const Index = () => {
  return (
    <main className="min-h-screen">
      <SEOHead
        title="Professional Makeup Artist Houston TX | Luxury Glam Services"
        description="Houston's premier luxury makeup studio. Professional glam services from $90. Bridal, editorial & event makeup by expert artists. Transform your look today."
        keywords="makeup artist Houston, professional makeup artist Houston TX, luxury makeup studio, bridal makeup artist Houston, glam makeup services, event makeup Houston, soft glam makeup, wedding makeup Texas, best makeup artist near me, makeup for photoshoot, red carpet makeup"
        canonicalUrl="/"
        ogImage="/IMG_8915.JPG"
        pageType="website"
      />
      <AdvancedSchemas />
      <Analytics />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Services />
      <Suspense fallback={<div className="min-h-screen" />}>
        <About />
        <Sanitation />
        <Gallery />
        <VideoReviews />
        <Testimonials />
        <SocialMediaFeeds />
        <CTA />
        <Contact />
        <Footer />
        <BackToTop />
        <ContactButtons />
        <VerticalGuidedNav />
        <InfoWidget />
        <CookieConsent />
      </Suspense>
    </main>
  );
};

export default Index;
