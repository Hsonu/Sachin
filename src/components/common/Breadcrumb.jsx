import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <div className="container">
        <ol className="breadcrumb-list">
          <li>
            <Link to="/" className="breadcrumb-link"><Home size={14} /> Home</Link>
          </li>
          {items.map((item, i) => (
            <li key={i}>
              <ChevronRight size={14} className="breadcrumb-sep" />
              {item.path ? (
                <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
