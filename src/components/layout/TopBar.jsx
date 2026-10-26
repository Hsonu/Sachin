import { Phone, Clock, Mail } from 'lucide-react';
import { BRAND } from '../../data/navigation';
import './TopBar.css';

export default function TopBar() {
  return (
    <div className="topbar hide-md-down">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <a href={`tel:${BRAND.phoneRaw}`} className="topbar-item topbar-link">
            <Phone size={14} className="topbar-icon accent" />
            {BRAND.phone}
          </a>
          <div className="topbar-item topbar-divider">
            <Clock size={14} className="topbar-icon" />
            {BRAND.hours}
          </div>
        </div>
        <div className="topbar-right">
          <a href={`mailto:${BRAND.email}`} className="topbar-item topbar-link">
            <Mail size={16} className="topbar-icon" />
            <span className="topbar-email">{BRAND.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
