import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { BRAND } from '../../data/navigation';
import './PromotionalBanner.css';

export default function PromotionalBanner() {
  const whatsappMsg = encodeURIComponent(
    'Hello Himalayan Kulfi, I am interested in custom printed packaging for my brand. Please share MOQ, design templates, and pricing.'
  );

  return (
    <section className="promo-banner-section">
      <div className="container">
        <div className="promo-banner-card">
          <div className="promo-banner-content">
            <div className="promo-badge">
              <Sparkles size={14} />
              <span>Custom Printing Solutions</span>
            </div>

            <h2 className="promo-title">
              Put Your Brand In Your Customers’ Hands
            </h2>

            <p className="promo-desc">
              Make your food and beverage stand out with bespoke branded packaging. We provide high-definition 6-color offset and flexographic printing on cups, boxes, pouches, and bags.
            </p>

            <div className="promo-features-grid">
              <div className="promo-feature">
                <CheckCircle2 size={18} className="promo-check" />
                <span>Low Minimum Order Quantities (From 5,000 pcs)</span>
              </div>
              <div className="promo-feature">
                <CheckCircle2 size={18} className="promo-check" />
                <span>Complimentary 3D Digital Packaging Mockups</span>
              </div>
              <div className="promo-feature">
                <CheckCircle2 size={18} className="promo-check" />
                <span>Food-Safe Odorless Soy & Water Inks</span>
              </div>
              <div className="promo-feature">
                <CheckCircle2 size={18} className="promo-check" />
                <span>Direct Doorstep Logistics Across India & Overseas</span>
              </div>
            </div>

            <div className="promo-actions">
              <a
                href={`https://wa.me/${BRAND.phoneRaw}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-promo-whatsapp"
              >
                <WhatsAppIcon size={20} />
                <span>Get Custom Quote on WhatsApp</span>
              </a>
              <Link to="/contact" className="btn-promo-contact">
                <span>Inquiry Form</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="promo-banner-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80"
              alt="Custom Printed Food Packaging"
              className="promo-banner-img"
              loading="lazy"
            />
            <div className="promo-image-badge">
              <span className="badge-highlight-number">10M+</span>
              <span className="badge-highlight-text">Cups & Boxes Manufactured Monthly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
