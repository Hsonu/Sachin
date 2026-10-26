import { Link } from 'react-router-dom';
import { Award, Leaf, Users, ShieldCheck, Factory, HeartHandshake, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { BRAND } from '../data/navigation';
import './About.css';

export default function About() {
  const breadcrumbs = [{ label: 'About Us', path: null }];

  return (
    <div className="about-page">
      <Breadcrumb items={breadcrumbs} />

      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <span className="section-badge">Our Story & Heritage</span>
          <h1 className="about-hero-title">
            Engineering Sustainable Food Packaging for a Greener Tomorrow
          </h1>
          <p className="about-hero-desc">
            {BRAND.name} is a premier manufacturer and exporter of eco-friendly paper cups, kraft food containers, and biodegradable tableware headquartered in Morbi, Gujarat.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            <div className="stat-card">
              <span className="stat-num">50,000+</span>
              <span className="stat-title">Sq. Ft. Production Facility</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">25 Million+</span>
              <span className="stat-title">Monthly Production Capacity</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">1,200+</span>
              <span className="stat-title">Hospitality & Cafe Clients</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">15+</span>
              <span className="stat-title">Export Destinations Worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story Grid */}
      <section className="about-mission-section">
        <div className="container">
          <div className="about-grid-2">
            <div className="about-text-content">
              <span className="section-badge">Vision & Philosophy</span>
              <h2 className="section-title">Replacing Plastic With Renewable Materials</h2>
              <p>
                Founded with a strong commitment to environmental sustainability, {BRAND.name} has grown from a specialized paper cup manufacturing unit into one of India’s most trusted comprehensive food packaging partners.
              </p>
              <p>
                Our factory in Gujarat features ultra-modern German and Taiwanese automated forming machines operating in dust-free, hygienic clean-room conditions. We exclusively use certified virgin food-grade paperboard and compostable sugarcane bagasse.
              </p>
              <div className="about-bullet-points">
                <div className="about-bullet">
                  <Leaf className="bullet-icon" size={20} />
                  <div>
                    <strong>100% Biodegradable & Compostable</strong>
                    <p>Designed to break down naturally without releasing microplastics or toxins into water bodies.</p>
                  </div>
                </div>
                <div className="about-bullet">
                  <ShieldCheck className="bullet-icon" size={20} />
                  <div>
                    <strong>Strict Hygiene & Food-Safe Inks</strong>
                    <p>Zero chemical odor. We print using FDA-compliant water and soy-based food contact inks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-image-card">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
                alt="Automated Packaging Manufacturing Facility"
                className="about-factory-img"
              />
              <div className="about-exp-badge">
                <span className="exp-years">10+</span>
                <span className="exp-text">Years of Packaging Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-badge">Why Himalayan Kulfi</span>
            <h2 className="section-title">Why Leading Brands Choose Us</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Factory size={28} />
              </div>
              <h3>Direct Manufacturer Pricing</h3>
              <p>Eliminate distributor markups. Order directly from our factory floor for maximum cost efficiency and consistent supply.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Award size={28} />
              </div>
              <h3>Rigorous Quality Audits</h3>
              <p>Every batch undergoes drop testing, leak resistance testing with hot liquids, and automated rim rigidity inspections.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <HeartHandshake size={28} />
              </div>
              <h3>End-to-End Customization</h3>
              <p>In-house graphic design studio to translate your cafe branding onto cups, food trays, sleeves, and delivery boxes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="about-cta-section">
        <div className="container text-center">
          <h2>Ready to Upgrade Your Packaging?</h2>
          <p>Join hundreds of cafes and cloud kitchens benefiting from direct factory supply.</p>
          <div className="about-cta-btns">
            <Link to="/product" className="btn btn-primary">
              <span>View Product Catalog</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <span>Contact Factory Representatives</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
