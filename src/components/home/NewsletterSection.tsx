import { MessageCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../ui/SocialIcons';
import { storeConfig } from '../../config/store';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

export default function NewsletterSection() {
  return (
    <section className="py-20 bg-midnight text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
          Connect With Us
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Join the Arabian Mens Circle
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
          Follow our latest collection drops on social media or reach out directly on WhatsApp to explore bespoke sizing or upcoming seasonal lines.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsAppContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold rounded shadow hover:bg-[#20ba59] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>

          <a
            href={storeConfig.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#1f1c19] border border-gold/40 text-gold text-xs uppercase tracking-wider font-semibold rounded hover:bg-gold hover:text-midnight transition-colors flex items-center gap-2"
          >
            <InstagramIcon className="w-4 h-4" />
            Instagram Lookbook
          </a>

          <a
            href={storeConfig.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#1f1c19] border border-gray-700 text-gray-300 text-xs uppercase tracking-wider font-semibold rounded hover:text-white transition-colors flex items-center gap-2"
          >
            <FacebookIcon className="w-4 h-4" />
            Facebook Page
          </a>
        </div>
      </div>
    </section>
  );
}
