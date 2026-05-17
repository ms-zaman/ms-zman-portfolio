import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

const Layout = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation />
      <ErrorBoundary>
        <main id="main-content" className="main-content">
          <Outlet />
        </main>
      </ErrorBoundary>
      <Footer />
    </>
  );
};

export default Layout;
