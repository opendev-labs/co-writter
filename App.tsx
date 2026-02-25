
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import { AppProvider } from './contexts/AppContext';
import CreatorSitePage from './pages/CreatorSitePage';
import EditEBookPage from './pages/EditEBookPage';
import EbookStudioPage from './pages/EbookStudioPage';
import EbookReaderPage from './pages/EbookReaderPage';
import HostingPreviewPage from './pages/HostingPreviewPage';
import { NanoPiChatButton } from './components/AIChatbot';

// Policy Pages
import ContactPage from './pages/ContactPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Reverting to HashRouter for stability in cloud/preview environments
const { HashRouter, Routes, Route, useLocation } = ReactRouterDOM as any;

const AnimatedRoutes = () => {
  const location = useLocation();

  // Scroll to top whenever the route changes
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="flex-grow flex flex-col animate-page-enter will-change-transform origin-top">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Internal Creator Page */}
        <Route path="/s/:slug" element={<CreatorSitePage />} />
        {/* Standalone Hosting Preview */}
        <Route path="/site/:username" element={<HostingPreviewPage />} />

        <Route path="/edit-ebook/:bookId" element={<EditEBookPage />} />
        <Route path="/ebook-studio" element={<EbookStudioPage />} />
        <Route path="/read/:bookId" element={<EbookReaderPage />} />

        {/* Policy Routes */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-black font-sans text-foreground overflow-x-hidden relative">

          {/* === GLOBAL ANTIGRAVITY THEME BACKGROUND === */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Deep Space Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,30,1)_0%,rgba(0,0,0,1)_100%)]"></div>

            {/* Floating Debris / Geometry */}
            <div className="absolute top-[20%] left-[15%] w-32 h-32 border border-white/5 rounded-full animate-float opacity-30 blur-[1px]"></div>
            <div className="absolute bottom-[25%] right-[20%] w-64 h-64 border border-white/5 rotate-45 animate-float-delayed opacity-20"></div>

            {/* Scanlines */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[grid-flow_8s_linear_infinite]"></div>
          </div>

          {/* === Foreground Content === */}
          <div className="flex-grow relative z-10 flex flex-col w-full">
            <Navbar />
            <main className="flex-grow flex flex-col">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>

          {/* === NanoPi Floating AI Chat === */}
          <NanoPiChatButton />

        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
