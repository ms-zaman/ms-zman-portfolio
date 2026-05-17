import { useState, useEffect, useRef, useCallback } from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const MobileMenu = ({ isHome = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
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

  return (
    <>
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

      {/* Mobile nav overlay — rendered outside nav-inner via portal-like positioning */}
      <div
        id={menuId}
        className={`mobile-nav ${isOpen ? 'open' : ''}`}
        role="menu"
        style={{ position: 'fixed', top: '52px', left: 0, right: 0, zIndex: 99 }}
      >
        <a href={isHome ? '#work' : '/#work'} onClick={closeMenu} role="menuitem">Work</a>
        <a href={isHome ? '#experience' : '/#experience'} onClick={closeMenu} role="menuitem">Experience</a>
        <a href={isHome ? '#contact' : '/#contact'} onClick={closeMenu} role="menuitem">Contact</a>
        <a href="/blog" onClick={closeMenu} role="menuitem">Blog</a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span className="status-badge">
            <span className="status-dot" aria-hidden="true"></span>
            Available
          </span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
