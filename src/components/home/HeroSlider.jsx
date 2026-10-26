import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import './HeroSlider.css';

const SLIDES = [
  {
    id: 1,
    series: 'PREMIUM BEVERAGE SERIES',
    titleStart: 'Insulated ',
    titleAccent: 'Double Wall',
    titleEnd: ' Coffee Cups',
    subtitle: 'Superior heat protection with a premium grip. Available in White & Kraft. Customizable with your brand logo.',
    tags: ['No Sleeve Required', 'Eco-Friendly', '100% Food Grade'],
    moq: '5,000',
    unit: 'pcs',
    accentColor: '#ff7c1a',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    alt: 'Double Wall Coffee Cups',
    ctaLink: '/product',
    ctaLabel: 'Explore Products',
  },
  {
    id: 2,
    series: 'ECO SALAD SERIES',
    titleStart: 'Sustainable ',
    titleAccent: 'Salad Bowl',
    titleEnd: ' Solutions',
    subtitle: 'Perfect for salads and grain bowls. Leak-resistant design crafted from 100% compostable heavy-duty kraft board.',
    tags: ['Oil Resistant', 'Food Grade', 'Clear PET Lid'],
    moq: '2,500',
    unit: 'pcs',
    accentColor: '#710a1d',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    alt: 'Eco Salad Bowls',
    ctaLink: '/product',
    ctaLabel: 'View Collection',
  },
  {
    id: 3,
    series: 'VERSATILE PACKAGING SERIES',
    titleStart: 'Eco-Friendly ',
    titleAccent: 'Paper Food Trays',
    titleEnd: ' & Boats',
    subtitle: 'Ideal for fries, sandwiches, and appetizers. Grease-proof design engineered for a flawless serving experience.',
    tags: ['Spill Proof', 'Oil Resistant', 'Quick Pop-Up'],
    moq: '4,000',
    unit: 'pcs',
    accentColor: '#ff7c1a',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80',
    alt: 'Eco Paper Food Trays',
    ctaLink: '/product',
    ctaLabel: 'Order Samples',
  },
  {
    id: 4,
    series: 'GOURMET FAST FOOD SERIES',
    titleStart: 'Heavy Duty ',
    titleAccent: 'Burger Boxes',
    titleEnd: ' & Clamshells',
    subtitle: 'Steam-vented clamshell kraft boxes engineered to keep gourmet burgers crisp and warm during rapid delivery.',
    tags: ['Tab Lock Mechanism', 'Steam Vented', 'Biodegradable'],
    moq: '3,000',
    unit: 'pcs',
    accentColor: '#710a1d',
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&auto=format&fit=crop&q=80',
    alt: 'Kraft Burger Boxes',
    ctaLink: '/product',
    ctaLabel: 'View Details',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const activeSlide = SLIDES[current];

  return (
    <section className="aahar-hero-section">
      <div className="container aahar-hero-container">
        <div className="aahar-hero-slide-wrapper">
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`aahar-hero-slide ${idx === current ? 'active' : ''}`}
            >
              <div className="aahar-hero-grid">
                {/* Content Card (Left) */}
                <div className="aahar-hero-content-col">
                  <div
                    className="aahar-hero-card"
                    style={{ '--accent-border': slide.accentColor }}
                  >
                    <span className="aahar-hero-series-tag">{slide.series}</span>
                    <h1 className="aahar-hero-title">
                      {slide.titleStart}
                      <span style={{ color: slide.accentColor }}>{slide.titleAccent}</span>
                      {slide.titleEnd}
                    </h1>
                    <p className="aahar-hero-sub">{slide.subtitle}</p>

                    <div className="aahar-hero-tags">
                      {slide.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="aahar-tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="aahar-hero-actions">
                      <Link to={slide.ctaLink} className="aahar-hero-btn">
                        <span>{slide.ctaLabel}</span>
                        <ArrowRight size={16} />
                      </Link>
                      <Link to="/contact" className="aahar-hero-btn-outline">
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Visual (Right) */}
                <div className="aahar-hero-img-col">
                  <div className="aahar-hero-img-stage">
                    <div
                      className="aahar-hero-ambient-glow"
                      style={{ '--glow-color': slide.accentColor }}
                    ></div>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="aahar-hero-product-img"
                    />
                    <div className="aahar-hero-moq-badge">
                      <p className="moq-label">MOQ Starting</p>
                      <p className="moq-val" style={{ color: slide.accentColor }}>
                        {slide.moq} <span className="moq-unit">{slide.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          className="aahar-slider-arrow prev"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          className="aahar-slider-arrow next"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className="aahar-slider-dots">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`aahar-slider-dot ${idx === current ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
