import { Sparkles, Layers, MessageCircle, HeartHandshake } from 'lucide-react';

export default function BrandBenefits() {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Thoughtfully Selected Styles',
      description: 'Every design is chosen for quality, premium drape, and modern masculine appeal.',
    },
    {
      icon: Layers,
      title: 'Versatile Wardrobe Staples',
      description: 'From casual weekend shirts to festive celebration kurtas, tailored for your lifestyle.',
    },
    {
      icon: MessageCircle,
      title: 'Convenient WhatsApp Ordering',
      description: 'Zero complex checkout forms. Confirm sizing, delivery, and payment directly with our team.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer-Focused Service',
      description: 'Attentive, personal support for size consultations and swift order fulfillment.',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-cream/50 border border-light-gray/60">
                <div className="w-12 h-12 rounded-full bg-midnight text-gold flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-midnight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-warm-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

