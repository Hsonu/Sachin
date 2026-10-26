import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, CheckCircle2, ShieldCheck, Truck, Sparkles, Copy, Check } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { formatPrice } from '../../utils/formatPrice';
import { BRAND } from '../../data/navigation';
import './ProductDetails.css';

export default function ProductDetails({ product }) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const {
    name,
    categoryName,
    categorySlug,
    price,
    originalPrice,
    unit = 'piece',
    packSize,
    moq,
    rating = 4.8,
    reviewCount = 12,
    shortDesc,
    description,
    features = [],
    specs = {},
  } = product;

  const whatsappMessage = encodeURIComponent(
    `Hello Himalayan Kulfi, I would like to inquire about wholesale prices for "${name}" (MOQ: ${moq || 'standard'}). Please provide full quotation.`
  );
  const whatsappUrl = `https://wa.me/${BRAND.phoneRaw}?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="product-details-pane">
      {/* Category & Title */}
      <div className="product-meta-header">
        <Link to={`/category/${categorySlug}`} className="product-category-link">
          {categoryName}
        </Link>
        <button
          type="button"
          className="btn-share-link"
          onClick={handleCopyLink}
          title="Share product link"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      <h1 className="product-detail-title">{name}</h1>

      {/* Reviews & Stock */}
      <div className="product-detail-reviews-row">
        <div className="product-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
            />
          ))}
        </div>
        <span className="rating-score">{rating}</span>
        <span className="reviews-text">({reviewCount} verified reviews)</span>
        <span className="badge-in-stock">In Stock & Ready to Ship</span>
      </div>

      {/* Pricing Box */}
      <div className="product-pricing-card">
        <div className="price-row">
          <span className="price-highlight">{formatPrice(price)}</span>
          <span className="price-unit-tag">/ {unit}</span>
          {originalPrice && originalPrice > price && (
            <span className="original-strikethrough">{formatPrice(originalPrice)}</span>
          )}
          <span className="tax-notice">(excl. GST & shipping)</span>
        </div>

        <div className="specs-quick-grid">
          {moq && (
            <div className="quick-spec-item">
              <span className="quick-spec-label">Min Order (MOQ)</span>
              <span className="quick-spec-val">{moq}</span>
            </div>
          )}
          {packSize && (
            <div className="quick-spec-item">
              <span className="quick-spec-label">Packaging</span>
              <span className="quick-spec-val">{packSize}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-cta-block">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta-whatsapp"
        >
          <WhatsAppIcon size={20} />
          <span>Inquire Wholesale on WhatsApp</span>
        </a>
        <a href={`tel:${BRAND.phoneRaw}`} className="btn-cta-phone">
          <Phone size={18} />
          <span>Call: {BRAND.phone}</span>
        </a>
      </div>

      {/* Value Trust Badges */}
      <div className="product-trust-tags">
        <div className="trust-tag">
          <ShieldCheck size={18} className="trust-icon" />
          <span>100% Food Grade Certified</span>
        </div>
        <div className="trust-tag">
          <Truck size={18} className="trust-icon" />
          <span>Pan-India & Export Shipping</span>
        </div>
        <div className="trust-tag">
          <Sparkles size={18} className="trust-icon" />
          <span>Custom Logo Printing Available</span>
        </div>
      </div>

      {/* Short Description */}
      {shortDesc && <p className="product-short-desc">{shortDesc}</p>}

      {/* Key Features */}
      {features.length > 0 && (
        <div className="product-features-section">
          <h3 className="section-subheading">Key Highlights</h3>
          <ul className="features-list">
            {features.map((feature, idx) => (
              <li key={idx} className="feature-item">
                <CheckCircle2 size={16} className="feature-icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications Table */}
      {Object.keys(specs).length > 0 && (
        <div className="product-specs-section">
          <h3 className="section-subheading">Technical Specifications</h3>
          <table className="specs-table">
            <tbody>
              {Object.entries(specs).map(([label, value]) => (
                <tr key={label}>
                  <td className="spec-label-col">{label}</td>
                  <td className="spec-value-col">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Description */}
      {description && (
        <div className="product-full-desc-section">
          <h3 className="section-subheading">Product Description</h3>
          <p className="full-desc-text">{description}</p>
        </div>
      )}
    </div>
  );
}
