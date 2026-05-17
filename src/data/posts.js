import postArchitecture from '../content/blog/example-post.md?raw';
import postWcag from '../content/blog/wcag-aa-dark-mode.md?raw';
import postScrollSnap from '../content/blog/css-scroll-snap.md?raw';
import postSwiper from '../content/blog/swiper-vs-splide.md?raw';
import postPortfolio from '../content/blog/optimizing-portfolio.md?raw';
import postVite from '../content/blog/vite-vs-cra.md?raw';
import postUseEffect from '../content/blog/understanding-useeffect.md?raw';

export const posts = [
  {
    slug: 'optimizing-react-portfolio-for-recruiters',
    title: 'How I Optimized My React Portfolio to Stand Out to Technical Recruiters',
    excerpt: 'A look into how I audited my portfolio to focus on clear communication, eliminating friction, and highlighting professional impact.',
    date: '2026-05-15',
    tags: ['Career', 'Portfolio', 'UX'],
    content: postPortfolio,
    readTime: '4 min read'
  },
  {
    slug: 'why-i-chose-vite-over-cra',
    title: 'Why I Chose Vite Over Create React App for My Portfolio',
    excerpt: 'A breakdown of why Vite is the new standard for React development and how it improved my developer experience.',
    date: '2026-05-02',
    tags: ['React', 'Performance', 'Tooling'],
    content: postVite,
    readTime: '3 min read'
  },
  {
    slug: 'wcag-aa-dark-mode-compliance',
    title: 'Designing a Dark Theme Portfolio with Full WCAG AA Compliance',
    excerpt: 'Why pure black and white is a mistake, and how to automate contrast checking in your React applications.',
    date: '2026-04-28',
    tags: ['Accessibility', 'CSS', 'Design'],
    content: postWcag,
    readTime: '5 min read'
  },
  {
    slug: 'understanding-react-useeffect',
    title: 'Understanding the React useEffect Hook Once and For All',
    excerpt: 'Reframing useEffect as a synchronization tool rather than a lifecycle method to avoid memory leaks and infinite loops.',
    date: '2026-04-18',
    tags: ['React', 'JavaScript', 'Best Practices'],
    content: postUseEffect,
    readTime: '4 min read'
  },
  {
    slug: 'clean-react-architecture',
    title: 'The Art of Clean React Architecture',
    excerpt: 'How separating the UI from the data layer makes your application scalable and future-proof. A deep dive into abstraction.',
    date: '2026-04-10',
    tags: ['React', 'Architecture', 'Best Practices'],
    content: postArchitecture,
    readTime: '4 min read'
  },
  {
    slug: 'migrating-swiper-to-splide',
    title: 'Cutting Bundle Size: Migrating from Swiper to Splide.js',
    excerpt: 'Swiper is great, but sometimes it is overkill. Here is why I migrated a recent client project to Splide for better performance.',
    date: '2026-03-22',
    tags: ['Performance', 'JavaScript', 'Optimization'],
    content: postSwiper,
    readTime: '3 min read'
  },
  {
    slug: 'native-css-scroll-snap',
    title: 'Why I Prefer Native CSS Scroll-Snap Over Heavy JS Libraries',
    excerpt: 'How I dropped heavy JavaScript slider dependencies in favor of native, performant CSS scroll-snap.',
    date: '2026-02-14',
    tags: ['CSS', 'Performance', 'UI'],
    content: postScrollSnap,
    readTime: '3 min read'
  }
];
