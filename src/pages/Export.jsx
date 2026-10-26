import { useState } from 'react';
import { Globe2, Anchor, ShieldCheck, CheckCircle2, Send, FileCheck } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { BRAND } from '../data/navigation';
import './Export.css';

export default function Export() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    phone: '',
    port: '',
    requirements: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `International Export Inquiry:\nCompany: ${formData.company} (${formData.name})\nCountry: ${formData.country}\nDischarge Port: ${formData.port}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDetails: ${formData.requirements}`
    );
    window.open(`https://wa.me/${BRAND.phoneRaw}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const breadcrumbs = [{ label: 'Export Inquiries', path: null }];

  return (
    <div className="export-page">
      <Breadcrumb items={breadcrumbs} />

      {/* Hero */}
      <section className="export-hero">
        <div className="container">
          <div className="export-badge">
            <Globe2 size={16} />
            <span>Worldwide Shipping</span>
          </div>
          <h1 className="export-hero-title">
            Global Export & Container Packaging Supply
          </h1>
          <p className="export-hero-desc">
            Strategic port proximity in Gujarat offering seamless ocean freight to the Middle East, Europe, Africa, the Americas, and Southeast Asia.
          </p>
        </div>
      </section>

      {/* Advantage Highlights */}
      <section className="export-advantages">
        <div className="container">
          <div className="advantages-grid">
            <div className="advantage-card">
              <Anchor size={32} className="adv-icon" />
              <h3>Direct Port Connectivity</h3>
              <p>Located in Morbi, close to Mundra Port & Kandla Port, ensuring low inland transit costs and rapid vessel loading.</p>
            </div>
            <div className="advantage-card">
              <ShieldCheck size={32} className="adv-icon" />
              <h3>International Certifications</h3>
              <p>FDA-compliant, ISO 9001:2015 quality certified, SGS laboratory tested, and FSC sustainable paperboard chain of custody.</p>
            </div>
            <div className="advantage-card">
              <FileCheck size={32} className="adv-icon" />
              <h3>Full Container Load (FCL & LCL)</h3>
              <p>Moisture-barrier pallet wrapping, export shrink wrapping, and maximized container cube utilization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Form & Process Section */}
      <section className="export-form-section">
        <div className="container">
          <div className="export-content-grid">
            <div className="export-process-info">
              <span className="section-badge">How We Export</span>
              <h2 className="section-title">Seamless Global Procurement</h2>
              
              <div className="export-steps">
                <div className="step-item">
                  <span className="step-number">01</span>
                  <div>
                    <h4>Quotation & Specification Review</h4>
                    <p>Provide sizes, GSM, and custom artwork. We provide CIF, FOB, or CFR rate proposals within 24 hours.</p>
                  </div>
                </div>
                <div className="step-item">
                  <span className="step-number">02</span>
                  <div>
                    <h4>Sampling & Pre-Production Approval</h4>
                    <p>Physical production samples and digital print proofs dispatched via DHL/FedEx courier for verification.</p>
                  </div>
                </div>
                <div className="step-item">
                  <span className="step-number">03</span>
                  <div>
                    <h4>Automated Manufacturing & QA Audit</h4>
                    <p>High-volume robotic manufacturing with automated inline camera defect screening.</p>
                  </div>
                </div>
                <div className="step-item">
                  <span className="step-number">04</span>
                  <div>
                    <h4>Container Stuffing & Ocean Dispatch</h4>
                    <p>Professional palletizing, container sealing with fumigation and complete bill of lading documentation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Inquiry Card */}
            <div className="export-form-card">
              <h3>Request Export Quotation</h3>
              <p>Direct communication with our overseas logistics desk.</p>

              {submitted ? (
                <div className="export-success">
                  <CheckCircle2 size={44} className="text-success" />
                  <h4>Inquiry Transmitted Successfully</h4>
                  <p>Our international trade specialist will reach out with port estimates shortly.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="export-form">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Company Ltd."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Country of Destination *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UAE / UK / USA"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="purchasing@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 555 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Discharge Port (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Jebel Ali / Felixstowe / Los Angeles"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Product Specifications & Container Estimate</label>
                    <textarea
                      rows="3"
                      placeholder="Details on sizes, target quantities (e.g. 1x40HQ container of 250ml ripple cups)..."
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-export-submit">
                    <Send size={18} />
                    <span>Submit Export RFQ</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
