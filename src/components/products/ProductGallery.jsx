import { useState } from 'react';
import './ProductGallery.css';

export default function ProductGallery({ images = [], name = 'Product' }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop'
  ];

  return (
    <div className="product-gallery">
      {/* Main Large Display Image */}
      <div className="product-gallery-main">
        <img
          src={displayImages[selectedIdx]}
          alt={`${name} view ${selectedIdx + 1}`}
          className="product-gallery-main-img"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="product-gallery-thumbs">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`product-gallery-thumb-btn ${idx === selectedIdx ? 'active' : ''}`}
              onClick={() => setSelectedIdx(idx)}
            >
              <img src={img} alt={`${name} thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
