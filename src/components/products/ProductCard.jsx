import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { formatPrice } from '../../utils/formatPrice';
import { BRAND } from '../../data/navigation';
import './ProductCard.css';

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    name,
    slug,
    categoryName,
    price,
    originalPrice,
    unit = 'piece',
    moq,
    rating = 4.8,
    reviewCount = 12,
    image,
    isBestseller,
    isNew,
    isFeatured,
  } = product;

  const whatsappMessage = encodeURIComponent(
    `Hello Himalayan Kulfi, I am interested in wholesale quotation for "${name}" (MOQ: ${moq || 'standard'}). Please share bulk pricing details.`
  );
  const whatsappUrl = `https://wa.me/${BRAND.phoneRaw}?text=${whatsappMessage}`;

  return (
    <div className="product-card">
      <div className="product-card-image-box">
        {/* Badges */}
        <div className="product-card-badges">
          {isBestseller && <span className="product-badge badge-bestseller">Bestseller</span>}
          {isNew && <span className="product-badge badge-new">New</span>}
          {isFeatured && !isBestseller && !isNew && (
            <span className="product-badge badge-featured">Featured</span>
          )}
        </div>

        <Link to={`/product/${slug}`} className="product-card-image-link">
          <img
            src={image}
            alt={name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&h=600&fit=crop';
            }}
          />
        </Link>
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{categoryName}</span>
        
        <h3 className="product-card-title">
          <Link to={`/product/${slug}`}>{name}</Link>
        </h3>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="product-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="rating-value">{rating}</span>
          <span className="review-count">({reviewCount})</span>
        </div>

        {/* Price & MOQ */}
        <div className="product-card-pricing">
          <div className="price-container">
            <span className="current-price">{formatPrice(price)}</span>
            <span className="price-unit">/{unit}</span>
            {originalPrice && originalPrice > price && (
              <span className="original-price">{formatPrice(originalPrice)}</span>
            )}
          </div>
          {moq && <div className="product-moq">MOQ: {moq}</div>}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <Link to={`/product/${slug}`} className="btn-view-product">
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-inquire"
            title="Inquire on WhatsApp"
            aria-label="Inquire on WhatsApp"
          >
            <WhatsAppIcon size={16} />
            <span>Inquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
}
