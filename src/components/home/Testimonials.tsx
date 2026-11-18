import { ShieldCheck, MessageCircle, Truck, RefreshCw } from 'lucide-react';
import { getWhatsAppContactUrl } from '../../lib/whatsapp';

export default function Testimonials() {
  const assurances = [
    {
      icon: MessageCircle,
      title: 'Direct Sizing Consultation',
      description:
        'Before dispatch, our boutique specialists verify your chest and shoulder dimensions over WhatsApp to ensure your selected garment drapes flawlessly.',
    },
    {
      icon: Truck,
      title: 'Dispatches in 24 Hours',
      description:
        'Orders are verified, carefully packaged, and handed to trusted courier partners across India within 24 to 48 hours with live tracking links in your chat.',
    },
    {
      icon: RefreshCw,
      title: 'Hassle-Free Sizing Swaps',
      description:
        'Need a different fit? Simply notify our team on WhatsApp within 48 hours of parcel arrival for swift replacement assistance.',
    },
  ];

  return (
    <section className="py-20 bg-cream border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
            The Arabian Menswear Standard
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-midnight font-bold tracking-tight">
            Direct Boutique Assurance
          </h2>
          <p className="text-xs text-warm-gray mt-2 font-light">
            Crafted for distinguished gentlemen who appreciate personal attention and uncompromising fabric quality.
          </p>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assurances.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-light-gray/80 shadow-xs flex flex-col justify-between hover:border-gold/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-midnight text-gold flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-midnight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-warm-gray leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-light-gray/60 mt-6 flex items-center gap-2 text-[11px] text-midnight font-semibold">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Guaranteed Boutique Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
