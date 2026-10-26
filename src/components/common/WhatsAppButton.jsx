import WhatsAppIcon from './WhatsAppIcon';
import { BRAND } from '../../data/navigation';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  return (
    <a
      href={BRAND.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span className="whatsapp-pulse"></span>
      <WhatsAppIcon size={32} />
    </a>
  );
}
