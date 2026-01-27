import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Services from "./pages/Services";
import TransformationsGallery from "./pages/TransformationsGallery";
import BookingSuccess from "./pages/BookingSuccess";
import Team from "./pages/Team";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

// Error Boundary Component - only show details in development
const ErrorFallback = ({ error }: { error: Error }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a',
      color: '#fafafa',
    }}>
      <h2 style={{ color: '#c9a96e', marginBottom: '16px' }}>Something went wrong</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>
        We're sorry, but something unexpected happened. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#c9a96e',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Refresh Page
      </button>
      {isDev && (
        <details style={{ marginTop: '32px', textAlign: 'left', maxWidth: '600px', width: '100%' }}>
          <summary style={{ cursor: 'pointer', color: '#ef4444' }}>Error Details (Dev Only)</summary>
          <pre style={{
            background: '#1a1a1a',
            padding: '16px',
            marginTop: '10px',
            overflow: 'auto',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#ef4444',
          }}>
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

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
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/about" element={<Team />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
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
