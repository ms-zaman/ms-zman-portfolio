/**
 * Inline SVG icons to replace the heavy @tabler/icons-webfont dependency.
 * Only the 7 icons actually used across the site are included here.
 * This eliminates ~400KB+ of CSS/webfont downloads.
 */

const iconProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  style: { display: 'inline-block', verticalAlign: '-0.125em' },
};

export const IconArrowRight = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M5 12h14" />
    <path d="M13 18l6-6" />
    <path d="M13 6l6 6" />
  </svg>
);

export const IconArrowUpRight = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M17 7l-10 10" />
    <path d="M8 7h9v9" />
  </svg>
);

export const IconArrowUp = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 5v14" />
    <path d="M18 11l-6-6" />
    <path d="M6 11l6-6" />
  </svg>
);

export const IconMail = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const IconBrandLinkedin = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M8 11v5" />
    <path d="M8 8v.01" />
    <path d="M12 16v-5" />
    <path d="M16 16v-3a2 2 0 0 0-4 0" />
  </svg>
);

export const IconBrandWhatsapp = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export const IconBrandGithub = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

export const IconMenu = (props) => (
  <svg {...iconProps} width="20" height="20" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const IconX = (props) => (
  <svg {...iconProps} width="20" height="20" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
