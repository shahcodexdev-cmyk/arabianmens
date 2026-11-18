import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import CheckoutModal from '../checkout/CheckoutModal';
import MobileBottomNav from '../navigation/MobileBottomNav';
import WhatsAppFloatingButton from '../ui/WhatsAppFloatingButton';
import SearchOverlay from './SearchOverlay';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <ScrollToTop />
      
      {/* Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Global Cart Slideout Drawer */}
      <CartDrawer />

      {/* Global WhatsApp Checkout Modal */}
      <CheckoutModal />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />

      {/* Search Overlay from bottom nav */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

