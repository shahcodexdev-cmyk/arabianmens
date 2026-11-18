import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../ui/SocialIcons';
import { storeConfig } from '../../config/store';
import { categories } from '../../data/categories';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight text-gray-300 border-t border-[#262420] pt-16 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#211f1c]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={storeConfig.logoPath}
                alt={storeConfig.brandName}
                className="h-16 w-auto object-contain rounded"
              />
              <div>
                <span className="block font-heading text-xl tracking-[0.2em] text-white uppercase">
                  Arabian
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-gold uppercase">
                  Mens Collection
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Upscale men's fashion combining Dubai-inspired luxury aesthetics with timeless
              comfort. Elevate your presence with thoughtfully tailored menswear.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppContactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded hover:bg-[#20ba59] transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                Order & Inquire via WhatsApp
              </a>
            </div>

            <div className="flex items-center space-x-4 pt-3">
              <a
                href={storeConfig.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#171513] border border-[#2b2723] flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={storeConfig.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#171513] border border-[#2b2723] flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:text-gold transition-colors">
                  Shop All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/collections/${cat.slug}`}
                    className="hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-gold transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping" className="hover:text-gold transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-gold transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white text-xs">WhatsApp Ordering</span>
                  <span>{storeConfig.contactPhone}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${storeConfig.contactEmail}`}
                  className="hover:text-gold transition-colors truncate"
                >
                  {storeConfig.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Pan India Delivery via WhatsApp Confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} {storeConfig.brandName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/policies/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/policies/terms" className="hover:text-gray-400 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <span className="text-gold/80">Premium WhatsApp Storefront</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
