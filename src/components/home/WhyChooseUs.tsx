import { ShieldCheck, Ruler, Truck, RefreshCw } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Ruler,
      title: 'Precision Sizing for Indian Men',
      description: 'Carefully measured cuts and proportions providing optimal chest, shoulder, and sleeve drape.',
    },
    {
      icon: ShieldCheck,
      title: 'Personalized Order Verification',
      description: 'Every order is reviewed manually with you on WhatsApp to ensure correct sizing and satisfaction before shipping.',
    },
    {
      icon: Truck,
      title: 'Pan India Shipping',
      description: 'Safe packaging and trackable couriers delivering straight to your home or office address across India.',
    },
    {
      icon: RefreshCw,
      title: 'Easy Exchange Assistance',
      description: 'Direct communication with our team makes sizing swaps or replacement inquiries straightforward.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
            The Brand Promise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-midnight font-bold tracking-tight">
            Why Choose Arabian Mens Collection?
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-lg bg-cream/50 border border-light-gray text-center space-y-3 hover:border-gold/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-midnight text-gold flex items-center justify-center mx-auto shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-midnight">
                  {pt.title}
                </h3>
                <p className="text-xs text-warm-gray leading-relaxed">
                  {pt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

