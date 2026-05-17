const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p>MS Zaman · {new Date().getFullYear()}</p>
          <p>Dhaka, Bangladesh</p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/ms-zaman"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <i className="ti ti-brand-github" aria-hidden="true"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/sharfuzzaman/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <i className="ti ti-brand-linkedin" aria-hidden="true"></i>
          </a>
          <a
            href="mailto:dev.mszaman@gmail.com"
            aria-label="Send email"
          >
            <i className="ti ti-mail" aria-hidden="true"></i>
          </a>
        </div>
      </div>
      <a href="#main-content" className="back-to-top">
        Back to top <i className="ti ti-arrow-up" aria-hidden="true"></i>
      </a>
    </footer>
  );
};

export default Footer;
