import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { storeConfig } from '../../config/store';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';
import AnnouncementBar from './AnnouncementBar';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Casual Wear', path: '/collections/casual-wear' },
    { name: 'Formal Wear', path: '/collections/formal-wear' },
    { name: 'Shirts & T-Shirts', path: '/collections/shirts-t-shirts' },
    { name: 'Kurtas & Traditional', path: '/collections/kurtas-traditional-wear' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <AnnouncementBar />

        <div
          className={`bg-midnight/95 backdrop-blur-md border-b transition-all duration-300 ${
            isScrolled ? 'border-[#332e26] shadow-2xl py-0' : 'border-[#1a1714] py-1'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 md:h-22">
              {/* Mobile menu trigger */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-white hover:text-gold transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Brand Logo */}
              <div className="flex-shrink-0 flex items-center justify-center lg:justify-start">
                <Link to="/" className="flex items-center gap-3 group">
                  <img
                    src={storeConfig.logoPath}
                    alt={storeConfig.brandName}
                    className="h-14 sm:h-16 w-auto object-contain rounded-md"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block font-heading text-lg sm:text-xl tracking-[0.2em] text-white uppercase group-hover:text-gold transition-colors">
                      Arabian
                    </span>
                    <span className="block text-[10px] tracking-[0.28em] text-gold uppercase font-medium">
                      Mens Collection
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-xs uppercase tracking-[0.2em] transition-all duration-200 py-1 relative font-semibold ${
                        isActive
                          ? 'text-gold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-gold'
                          : 'text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              {/* Right Utility Actions (Search, WhatsApp, Cart) */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-gold transition-colors"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>

                {/* Direct WhatsApp Quick Chat Pill (Desktop) */}
                <a
                  href={getWhatsAppContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1916] border border-gold/40 text-gold text-xs font-semibold hover:bg-gold hover:text-midnight transition-all shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>

                {/* Cart Action with live badge */}
                <button
                  type="button"
                  onClick={openDrawer}
                  className="p-2 text-gray-300 hover:text-gold transition-colors relative"
                  aria-label={`Shopping cart with ${itemCount} items`}
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-gold text-midnight font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
