import { MessageCircle } from 'lucide-react';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={getWhatsAppContactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 group"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="w-6 h-6 text-white fill-white" />
      <span className="absolute right-full mr-3 whitespace-nowrap bg-charcoal text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md">
        Chat with us
      </span>
    </a>
  );
}
