import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Sanitation from '@/components/Sanitation';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
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
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import VerticalGuidedNav from '@/components/VerticalGuidedNav';
import InfoWidget from '@/components/InfoWidget';

const Index = () => {
  return (
    <main className="min-h-screen">
      <SEOHead
        title="Luxury Makeup Artistry & Beauty Services"
        description="Transform your look with expert makeup artists at HDA Studio. Professional glam services from natural soft glam ($90) to signature red carpet looks ($180). Book your appointment today."
        keywords="luxury makeup artist, professional beauty services, glam makeup, bridal makeup, event makeup, soft glam, signature glam, makeup studio near me, professional makeup artist"
        canonicalUrl="/"
        ogImage="/IMG_8915.JPG"
      />
      <OrganizationSchema />
      <Analytics />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Sanitation />
      <Gallery />
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
