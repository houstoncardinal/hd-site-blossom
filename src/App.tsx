import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Services from "./pages/Services";
import TransformationsGallery from "./pages/TransformationsGallery";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Team from "./pages/Team";
import Reviews from "./pages/Reviews";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import QuinceaneraServices from "./pages/QuinceaneraServices";
import PromServices from "./pages/PromServices";
import BridalServices from "./pages/BridalServices";

const queryClient = new QueryClient();

// Error Boundary Component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: 'red',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h2>Application Error</h2>
    <p>Something went wrong while loading the application.</p>
    <details style={{ marginTop: '20px', textAlign: 'left' }}>
      <summary>Error Details</summary>
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', overflow: 'auto' }}>
        {error.message}
        {'\n\n'}
        {error.stack}
      </pre>
    </details>
  </div>
);

// Main App Component with Error Boundary
const AppContent = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<TransformationsGallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/about" element={<Team />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/quinceanera" element={<QuinceaneraServices />} />
            <Route path="/prom" element={<PromServices />} />
            <Route path="/bridal" element={<BridalServices />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

// App with Error Boundary
const App = () => {
  try {
    return <AppContent />;
  } catch (error) {
    console.error('App Error:', error);
    return <ErrorFallback error={error as Error} />;
  }
};

export default App;
