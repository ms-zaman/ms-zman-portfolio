import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const isHome = location.pathname === '/';
  const menuId = 'mobile-navigation';

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="MS Zaman — Home">
          <span>MS</span>.Zaman
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li><a href={isHome ? '#work' : '/#work'}>Work</a></li>
          <li><a href={isHome ? '#experience' : '/#experience'}>Experience</a></li>
          <li><a href={isHome ? '#contact' : '/#contact'}>Contact</a></li>
          <li>
            <span className="status-badge">
              <span className="status-dot" aria-hidden="true"></span>
              Available
            </span>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          ref={toggleRef}
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={menuRef}
        id={menuId}
        className={`mobile-nav ${isOpen ? 'open' : ''}`}
        role="menu"
      >
        <a href={isHome ? '#work' : '/#work'} onClick={closeMenu} role="menuitem">Work</a>
        <a href={isHome ? '#experience' : '/#experience'} onClick={closeMenu} role="menuitem">Experience</a>
        <a href={isHome ? '#contact' : '/#contact'} onClick={closeMenu} role="menuitem">Contact</a>
        <span className="status-badge" style={{ padding: '0.5rem 0' }}>
          <span className="status-dot" aria-hidden="true"></span>
          Available
        </span>
      </div>
    </nav>
  );
};

export default Navigation;
