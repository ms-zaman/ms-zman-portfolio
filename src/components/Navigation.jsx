import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span>MS</span>.Zaman
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li><a href={isHome ? '#work' : '/#work'}>Work</a></li>
          <li><a href={isHome ? '#experience' : '/#experience'}>Experience</a></li>
          <li><a href={isHome ? '#contact' : '/#contact'}>Contact</a></li>
          <li>
            <span className="status-badge">
              <span className="status-dot"></span>
              Available
            </span>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <a href={isHome ? '#work' : '/#work'} onClick={() => setIsOpen(false)}>Work</a>
        <a href={isHome ? '#experience' : '/#experience'} onClick={() => setIsOpen(false)}>Experience</a>
        <a href={isHome ? '#contact' : '/#contact'} onClick={() => setIsOpen(false)}>Contact</a>
        <span className="status-badge" style={{ padding: '0.5rem 0' }}>
          <span className="status-dot"></span>
          Available
        </span>
      </div>
    </nav>
  );
};

export default Navigation;
