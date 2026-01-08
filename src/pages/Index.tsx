import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Sanitation from '@/components/Sanitation';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import VideoReviews from '@/components/VideoReviews';
import InstagramFeed from '@/components/InstagramFeed';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import ContactButtons from '@/components/ContactButtons';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import SEOHead from '@/components/seo/SEOHead';
import AdvancedSchemas from '@/components/seo/AdvancedSchemas';
import VerticalGuidedNav from '@/components/VerticalGuidedNav';
import InfoWidget from '@/components/InfoWidget';

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
      <About />
      <Sanitation />
      <Gallery />
      <VideoReviews />
      <Testimonials />
      <InstagramFeed />
      <CTA />
      <Contact />
      <Footer />
      <BackToTop />
      <ContactButtons />
      <VerticalGuidedNav />
      <InfoWidget />
      <CookieConsent />
    </main>
  );
};

export default Index;
