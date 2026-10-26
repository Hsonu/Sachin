import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="container not-found-content">
        <span className="not-found-badge">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="/product" className="btn btn-outline">
            <ArrowLeft size={18} />
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
