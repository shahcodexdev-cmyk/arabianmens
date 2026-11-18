import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, MessageCircle, ChevronRight, Phone } from 'lucide-react';
import { InstagramIcon } from '../ui/SocialIcons';
import { storeConfig } from '../../config/store';
import { categories } from '../../data/categories';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="relative w-full max-w-xs bg-midnight border-r border-[#332e26] text-white flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292725]">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <img
              src={storeConfig.logoPath}
              alt={storeConfig.brandName}
              className="h-10 w-auto object-contain rounded"
            />
            <span className="font-heading text-base tracking-widest text-gold uppercase">
              Arabian
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Links */}
        <div className="py-4 px-5 space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-semibold mb-3">
            Collections
          </p>
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between py-2.5 text-sm uppercase tracking-wider ${
                isActive ? 'text-gold font-semibold' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Home
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </NavLink>

          <NavLink
            to="/shop"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between py-2.5 text-sm uppercase tracking-wider ${
                isActive ? 'text-gold font-semibold' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Shop All
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </NavLink>

          {categories.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between py-2.5 text-sm tracking-wide ${
                  isActive ? 'text-gold font-semibold' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {cat.name}
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#292725] my-2" />

        {/* Information Links */}
        <div className="py-3 px-5 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-semibold mb-3">
            Customer Care
          </p>
          <Link
            to="/about"
            onClick={onClose}
            className="block py-1.5 text-sm text-gray-400 hover:text-white"
          >
            About Us
          </Link>
          <Link
            to="/size-guide"
            onClick={onClose}
            className="block py-1.5 text-sm text-gray-400 hover:text-white"
          >
            Size Guide
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="block py-1.5 text-sm text-gray-400 hover:text-white"
          >
            Contact Us
          </Link>
          <Link
            to="/faq"
            onClick={onClose}
            className="block py-1.5 text-sm text-gray-400 hover:text-white"
          >
            FAQ
          </Link>
        </div>

        {/* Footer / WhatsApp CTA */}
        <div className="mt-auto p-5 border-t border-[#292725] bg-[#0d0d0d]">
          <a
            href={getWhatsAppContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium text-sm rounded shadow hover:bg-[#20ba59] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <a
              href={`tel:${storeConfig.whatsappNumber}`}
              className="flex items-center gap-1 hover:text-gold"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <span>•</span>
            <a
              href={storeConfig.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gold"
            >
              <InstagramIcon className="w-3.5 h-3.5" /> Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
