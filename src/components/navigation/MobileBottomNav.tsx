import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

interface MobileBottomNavProps {
  onSearchClick: () => void;
}

export default function MobileBottomNav({ onSearchClick }: MobileBottomNavProps) {
  const { itemCount, openDrawer } = useCart();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-midnight/95 backdrop-blur-md border-t border-[#2d2925] lg:hidden pb-safe">
      <div className="grid grid-cols-5 h-16">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
            isActive('/') ? 'text-gold' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
            isActive('/shop') || isActive('/collections')
              ? 'text-gold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-1" />
          <span>Shop</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center text-[10px] font-medium text-gray-400 hover:text-white transition-colors"
          aria-label="Search products"
        >
          <Search className="w-5 h-5 mb-1" />
          <span>Search</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center text-[10px] font-medium text-gray-400 hover:text-white transition-colors relative"
          aria-label={`Cart with ${itemCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold text-midnight font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* WhatsApp */}
        <a
          href={getWhatsAppContactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-[10px] font-medium text-[#25D366] hover:text-[#20ba59] transition-colors"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}

