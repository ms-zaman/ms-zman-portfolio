import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max">
        <div className="section-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Sharfuzzaman</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Frontend Developer crafting digital experiences that feel like home. 
                Building interfaces that are not just pixel-perfect, but human-perfect.
              </p>
              <p className="text-gray-400 text-sm">
                Always curious, always learning, always up for an interesting conversation.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/work" className="text-gray-300 hover:text-white transition-colors">
                    Work
                  </Link>
                </li>
                <li>
                  <Link to="/beyond-code" className="text-gray-300 hover:text-white transition-colors">
                    Beyond Code
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:sharfuzzaman@example.com" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">📧</span>
                    Email
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com/in/sharfuzzaman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">💼</span>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/sharfuzzaman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">🐦</span>
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/sharfuzzaman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">💻</span>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Sharfuzzaman. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Built with React, TanStack, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
