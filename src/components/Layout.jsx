import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
