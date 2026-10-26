import { useState } from 'react';
import { Send, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../data/navigation';
import './BulkOrderCTA.css';

export default function BulkOrderCTA() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: 'Paper Cup',
    quantity: '10,000 pcs',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate inquiry submission or redirect to WhatsApp
    const msg = encodeURIComponent(
      `Bulk Inquiry from ${formData.name} (${formData.phone}, ${formData.email}):\nProduct: ${formData.product}\nQuantity: ${formData.quantity}\nNotes: ${formData.message}`
    );
    window.open(`https://wa.me/${BRAND.phoneRaw}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section className="bulk-cta-section">
      <div className="container">
        <div className="bulk-cta-grid">
          <div className="bulk-cta-info">
            <span className="section-badge">Wholesale & Export</span>
            <h2 className="bulk-cta-title">Need High Volume or Custom Packaging?</h2>
            <p className="bulk-cta-desc">
              Whether you need 10,000 paper cups or full shipping container consignments for export, our factory delivers on time at unmatchable direct-manufacturing rates.
            </p>

            <div className="bulk-contact-details">
              <a href={`tel:${BRAND.phoneRaw}`} className="bulk-contact-item">
                <div className="contact-icon-bubble">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="contact-label">Talk to Factory Sales</span>
                  <span className="contact-val">{BRAND.phone}</span>
                </div>
              </a>

              <a href={`mailto:${BRAND.email}`} className="bulk-contact-item">
                <div className="contact-icon-bubble">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="contact-label">Send Requirements Email</span>
                  <span className="contact-val">{BRAND.email}</span>
                </div>
              </a>
            </div>
          </div>

          <div className="bulk-cta-form-card">
            <h3 className="form-card-title">Instant Bulk Inquiry</h3>
            <p className="form-card-subtitle">Receive customized quotation within 15 minutes.</p>

            {submitted ? (
              <div className="form-success-box">
                <CheckCircle2 size={44} className="text-success" />
                <h4>Thank You for Reaching Out!</h4>
                <p>Our sales team will connect with your quote shortly.</p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bulk-form">
                <div className="form-field">
                  <label htmlFor="bulk-name">Your Name / Business Name *</label>
                  <input
                    id="bulk-name"
                    type="text"
                    required
                    placeholder="e.g. Blue Tokai Cafe / Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="bulk-phone">Phone / WhatsApp *</label>
                    <input
                      id="bulk-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="bulk-email">Email Address</label>
                    <input
                      id="bulk-email"
                      type="email"
                      placeholder="orders@yourcafe.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="bulk-product">Product Required</label>
                    <select
                      id="bulk-product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    >
                      <option value="Paper Cup">Paper Cups</option>
                      <option value="Burger Boxes">Burger Boxes</option>
                      <option value="Food Box">Food / Meal Boxes</option>
                      <option value="Bagasse Products">Bagasse Plates & Bowls</option>
                      <option value="Paper Straws">Paper Straws</option>
                      <option value="Custom Branding">Custom Printed Packaging</option>
                      <option value="Other">Other / Full Range</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="bulk-quantity">Estimated Quantity</label>
                    <select
                      id="bulk-quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    >
                      <option value="5,000 - 10,000 pcs">5,000 - 10,000 pcs</option>
                      <option value="10,000 - 50,000 pcs">10,000 - 50,000 pcs</option>
                      <option value="50,000 - 200,000 pcs">50,000 - 200,000 pcs</option>
                      <option value="Full Container Load">Full Container Load (Export)</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="bulk-message">Special Notes / Sizes</label>
                  <textarea
                    id="bulk-message"
                    rows="3"
                    placeholder="Provide specific sizes, GSM, or design requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-inquiry">
                  <Send size={18} />
                  <span>Request Instant Quotation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
