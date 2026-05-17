/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'mono': ['DM Mono', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0b0b0b',
          2: '#111111',
          3: '#181818',
        },
        text: {
          DEFAULT: '#e4e2dc',
          2: '#686663',
          3: '#484644',
        },
        accent: {
          DEFAULT: '#3d8ee8',
          dim: 'rgba(61,142,232,0.12)',
        },
        green: {
          DEFAULT: '#3dba7f',
          dim: 'rgba(61,186,127,0.12)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          2: 'rgba(255,255,255,0.11)',
        },
      },
      maxWidth: {
        'content': '680px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
      },
    },
  },
  plugins: [],
}
