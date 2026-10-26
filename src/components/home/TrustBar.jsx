import { Leaf, DollarSign, Palette, Globe2 } from 'lucide-react';
import './TrustBar.css';

const TRUST_ITEMS = [
  {
    icon: Leaf,
    title: '100% Eco-Friendly',
    desc: 'Biodegradable, compostable and plastic-free materials',
  },
  {
    icon: DollarSign,
    title: 'Wholesale Factory Prices',
    desc: 'Direct manufacturer pricing with high volume discounts',
  },
  {
    icon: Palette,
    title: 'Custom Brand Printing',
    desc: 'Bespoke logo printing with food-safe plant-based inks',
  },
  {
    icon: Globe2,
    title: 'Pan-India & Global Export',
    desc: 'Fast freight fulfillment across India and international ports',
  },
];

export default function TrustBar() {
  return (
    <section className="trustbar-section">
      <div className="container">
        <div className="trustbar-grid">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="trustbar-card">
                <div className="trustbar-icon-box">
                  <Icon size={24} />
                </div>
                <div className="trustbar-text">
                  <h4 className="trustbar-title">{item.title}</h4>
                  <p className="trustbar-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
