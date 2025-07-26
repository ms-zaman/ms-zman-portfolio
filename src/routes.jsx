import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Work from './pages/Work';
import BeyondCode from './pages/BeyondCode';
import Contact from './pages/Contact';

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
        path: 'about',
        element: <About />,
      },
      {
        path: 'work',
        element: <Work />,
      },
      {
        path: 'beyond-code',
        element: <BeyondCode />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);
