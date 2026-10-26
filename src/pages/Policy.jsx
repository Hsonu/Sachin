import { useLocation, Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { BRAND, POLICY_LINKS } from '../data/navigation';
import './Policy.css';

const POLICY_DATA = {
  '/privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        content: `At ${BRAND.name}, we collect information provided directly by you when you place wholesale orders, request quotations, subscribe to catalog updates, or contact our sales team via WhatsApp, email, or telephone. This includes business name, GST/tax ID, delivery address, contact person, phone number, and transaction records.`,
      },
      {
        heading: '2. How We Use Your Information',
        content: `We use collected information solely to process bulk product orders, manufacture custom printed products according to submitted designs, arrange logistics and ocean freight, process invoices, and provide order dispatch tracking notifications.`,
      },
      {
        heading: '3. Data Security & Third-Party Sharing',
        content: `We implement robust physical, electronic, and managerial safeguards to protect your proprietary business data and artwork files. We do not sell or rent customer data. Information is shared only with verified freight forwarders, couriers, and statutory regulatory customs bodies for shipment clearance.`,
      },
    ],
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Quotations & Pricing',
        content: `All quotes issued by ${BRAND.name} are valid for 15 calendar days from the date of issuance due to raw paperboard commodity price fluctuations. Quotations are subject to applicable GST and freight tariffs unless explicitly stated as CIF or Delivered Duty Paid.`,
      },
      {
        heading: '2. Custom Print Tolerances & Approvals',
        content: `Production of custom printed cups, boxes, and pouches begins only after signed digital or physical sample approval. A production over-run or under-run tolerance of ±5% is standard for bulk customized flexographic/offset manufacturing runs and will be invoiced accordingly.`,
      },
      {
        heading: '3. Intellectual Property Rights',
        content: `Clients warrant that all brand logos, trademarks, and artwork provided for printing are rightfully owned or licensed by them. ${BRAND.name} is indemnified against any trademark infringement claims resulting from client-supplied assets.`,
      },
    ],
  },
  '/order-policy': {
    title: 'Order & Manufacturing Policy',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Minimum Order Quantities (MOQs)',
        content: `Standard catalog products have an MOQ of 1 carton (typically 500 - 1,000 pcs). Custom branded printed packaging carries an MOQ starting from 5,000 units per design variant depending on cup size or container structure.`,
      },
      {
        heading: '2. Production Lead Times',
        content: `Standard unprinted catalog items are dispatched from warehouse stock within 24 to 48 hours of order confirmation. Custom printed runs require 7 to 14 business days from final proof approval to dispatch.`,
      },
      {
        heading: '3. Payment Terms',
        content: `For standard wholesale orders, 100% advance payment is required prior to dispatch. For custom printing and export container orders, terms are 50% advance with purchase order and 50% balance against inspection or Bill of Lading copy.`,
      },
    ],
  },
  '/return-policy': {
    title: 'Returns & Replacement Policy',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Food-Grade Product Return Restrictions',
        content: `Due to strict food-safety and hygiene regulations governing disposable paper and bagasse tableware, opened sleeves or used products cannot be returned or restocked under any circumstances.`,
      },
      {
        heading: '2. Manufacturing Defect & Transit Claims',
        content: `In the rare event of manufacturing defects (such as seam leakage or rim deformation) or transit damage, notification must be submitted within 48 hours of shipment delivery accompanied by photographs and carton batch numbers.`,
      },
      {
        heading: '3. Replacements & Resolution',
        content: `Verified defective units will be replaced free of charge on the next dispatch or credited toward the buyer’s account ledger. Customer satisfaction and long-term partnership are our utmost priorities.`,
      },
    ],
  },
};

export default function Policy() {
  const location = useLocation();
  const currentPath = location.pathname;
  const policy = POLICY_DATA[currentPath] || POLICY_DATA['/privacy-policy'];

  const breadcrumbs = [
    { label: 'Policies', path: null },
    { label: policy.title, path: null },
  ];

  return (
    <div className="policy-page">
      <Breadcrumb items={breadcrumbs} />

      <section className="policy-hero">
        <div className="container">
          <h1 className="policy-main-title">{policy.title}</h1>
          <p className="policy-update-date">Effective: {policy.lastUpdated} | {BRAND.name}</p>
        </div>
      </section>

      <section className="policy-body-section">
        <div className="container">
          <div className="policy-grid-layout">
            {/* Sidebar Navigation */}
            <aside className="policy-sidebar">
              <h3 className="policy-sidebar-title">All Legal & Policies</h3>
              <nav className="policy-nav-list">
                {POLICY_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`policy-nav-item ${currentPath === link.path ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <main className="policy-content-article">
              {policy.sections.map((section, idx) => (
                <div key={idx} className="policy-section-block">
                  <h2 className="policy-section-heading">{section.heading}</h2>
                  <p className="policy-section-text">{section.content}</p>
                </div>
              ))}

              <div className="policy-contact-box">
                <h4>Questions Regarding Policies?</h4>
                <p>
                  Contact our compliance and corporate governance team at{' '}
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or call{' '}
                  <a href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a>.
                </p>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
