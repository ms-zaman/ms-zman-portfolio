import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Lazy-load blog routes — these pull in react-markdown, react-syntax-highlighter,
// fuse.js, remark-gfm, and date-fns which are ~150KB+ combined. No need to
// load them on the home page which is where 95%+ of visitors land.
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LazyFallback = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LazyFallback />}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: 'blog/:slug',
        element: (
          <Suspense fallback={<LazyFallback />}>
            <BlogPost />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LazyFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
