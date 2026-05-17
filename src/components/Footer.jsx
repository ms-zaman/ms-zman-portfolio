import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconArrowUp,
} from './Icons';

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
            <IconBrandGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/sharfuzzaman/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <IconBrandLinkedin />
          </a>
          <a
            href="mailto:dev.mszaman@gmail.com"
            aria-label="Send email"
          >
            <IconMail />
          </a>
        </div>
      </div>
      <a href="#main-content" className="back-to-top">
        Back to top <IconArrowUp />
      </a>
    </footer>
  );
};

export default Footer;
