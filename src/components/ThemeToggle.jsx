import { useState, useEffect } from 'react';

export const IconSun = (props) => (
  <svg 
    width="1em" 
    height="1em" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true" 
    style={{ display: 'inline-block', verticalAlign: '-0.125em' }}
    {...props}
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);

export const IconMoon = (props) => (
  <svg 
    width="1em" 
    height="1em" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true" 
    style={{ display: 'inline-block', verticalAlign: '-0.125em' }}
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState('dark');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersLight) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth color change
    document.documentElement.classList.add('theme-transition');
    
    // Update theme
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Save to state and storage
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-2)',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-2)'}
    >
      {theme === 'dark' ? <IconSun width="20" height="20" /> : <IconMoon width="20" height="20" />}
    </button>
  );
};

export default ThemeToggle;
