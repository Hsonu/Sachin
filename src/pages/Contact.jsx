import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '../components/common/WhatsAppIcon';
import Breadcrumb from '../components/common/Breadcrumb';
import { BRAND } from '../data/navigation';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Contact Form Message from ${formData.name} (${formData.phone}, ${formData.email}):\nSubject: ${formData.subject}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/${BRAND.phoneRaw}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const breadcrumbs = [{ label: 'Contact Us', path: null }];

  return (
    <div className="contact-page">
      <Breadcrumb items={breadcrumbs} />

      <section className="contact-hero">
        <div className="container">
          <span className="section-badge">Get in Touch</span>
          <h1 className="contact-hero-title">Contact Factory Sales & Support</h1>
          <p className="contact-hero-desc">
            Have questions about product sizes, custom printing, samples, or wholesale volume pricing? Our packaging experts are here to assist you.
          </p>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details Column */}
            <div className="contact-info-col">
              <h2 className="info-heading">Direct Contact Information</h2>
              <p className="info-sub">Feel free to reach out via call, WhatsApp, or visit our manufacturing plant.</p>

              <div className="contact-card-list">
                <a href={`tel:${BRAND.phoneRaw}`} className="contact-info-card">
                  <div className="info-icon-bubble">
                    <Phone size={22} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Call Customer Support</span>
                    <span className="info-value">{BRAND.phone}</span>
                    <span className="info-hint">Toll free / Direct mobile line</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${BRAND.phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-card"
                >
                  <div className="info-icon-bubble whatsapp">
                    <WhatsAppIcon size={24} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">WhatsApp Fast Quotation</span>
                    <span className="info-value">{BRAND.phone}</span>
                    <span className="info-hint">Typical response within 15 minutes</span>
                  </div>
                </a>

                <a href={`mailto:${BRAND.email}`} className="contact-info-card">
                  <div className="info-icon-bubble">
                    <Mail size={22} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Official Email</span>
                    <span className="info-value">{BRAND.email}</span>
                    <span className="info-hint">For RFQs, bids, and export documentation</span>
                  </div>
                </a>

                <div className="contact-info-card">
                  <div className="info-icon-bubble">
                    <Clock size={22} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Working Hours</span>
                    <span className="info-value">{BRAND.hours}</span>
                    <span className="info-hint">Factory dispatch Monday through Saturday</span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="info-icon-bubble">
                    <MapPin size={22} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Factory & Office Address</span>
                    <span className="info-value">{BRAND.name} Manufacturing Plant</span>
                    <span className="info-hint">{BRAND.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="contact-form-col">
              <div className="contact-form-box">
                <h3 className="form-box-title">Send Us a Direct Message</h3>
                <p className="form-box-desc">Fill out your requirements below and we'll reply right away.</p>

                {submitted ? (
                  <div className="contact-success-state">
                    <CheckCircle2 size={48} className="text-success" />
                    <h4>Message Dispatched!</h4>
                    <p>Thank you for reaching out to {BRAND.name}. Our team has received your inquiry.</p>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-field">
                      <label htmlFor="c-name">Full Name *</label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        placeholder="e.g. Vikram Singhania"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label htmlFor="c-phone">Phone / WhatsApp Number *</label>
                        <input
                          id="c-phone"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="c-email">Email Address</label>
                        <input
                          id="c-email"
                          type="email"
                          placeholder="vikram@cafe.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="c-sub">Subject / Inquiring About *</label>
                      <input
                        id="c-sub"
                        type="text"
                        required
                        placeholder="e.g. Wholesale Quotation for 250ml Ripple Cups"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="c-msg">Message / Requirements *</label>
                      <textarea
                        id="c-msg"
                        rows="4"
                        required
                        placeholder="Please include target quantity, delivery destination, and any custom printing preferences..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-send-contact">
                      <Send size={18} />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
