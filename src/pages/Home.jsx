import FadeIn from '../components/FadeIn';

const EXPERIENCE = [
  {
    role: 'Frontend Developer',
    company: 'Startise',
    period: 'Sep 2025 – Present · Dhaka',
    desc: '',
    current: true,
  },
  {
    role: 'Jr. Frontend Developer',
    company: 'Startise',
    period: 'Nov 2022 – Sep 2025 · 2 yrs 11 mos · Dhaka',
    desc: '',
    current: false,
  },
  {
    role: 'Frontend Developer',
    company: 'American Best IT — Digital Marketing Agency',
    period: 'Jan 2022 – Oct 2022 · 10 mos · Dhaka',
    desc: '',
    current: false,
  },
  {
    role: 'Frontend Web Developer',
    company: 'Technofelia',
    period: 'Jan 2021 – Oct 2021 · 10 mos · Dhaka',
    desc: 'Contributed to Hisabee — a collaborative web application. Built responsive interfaces and delivered clean, user-friendly solutions across frontend and backend tasks.',
    current: false,
  },
];

const GUTENBERG_TEMPLATES = [
  { name: 'MindXtend', cat: 'Business Consultancy', url: 'https://templately.com/pack/mindxtend-business-consultancy-template-gutenberg' },
  { name: 'NaturExplo', cat: 'Travel & Eco-Tourism', url: 'https://templately.com/pack/naturexplo-gutenberg-travel-eco-tourism-template' },
  { name: 'SnapCatch', cat: 'Photography', url: 'https://templately.com/pack/snapcatch-gutenberg-photography-template' },
  { name: 'NooCodeHub', cat: 'No-Code Community', url: 'https://templately.com/pack/noocodehub-gutenberg-no-code-community' },
  { name: 'D-Care', cat: 'Dentist Clinic', url: 'https://templately.com/pack/d-care-gutenberg-dentist-clinic-template' },
  { name: 'NatureTreat', cat: 'Ecotourism', url: 'https://templately.com/pack/naturetreat-gutenberg-ecotourism-template' },
];

const ELEMENTOR_TEMPLATES = [
  { name: 'BookAnAir', cat: 'Flight Booking', url: 'https://templately.com/pack/bookanair-elementor-flight-booking-website' },
  { name: 'FlexiDropper', cat: 'Dropshipping Agency', url: 'https://templately.com/pack/flexidropper-elementor-dropshipping-agency-template' },
  { name: 'Multigency', cat: 'Multipurpose', url: 'https://templately.com/pack/multigency-elementor-multipurpose-template' },
  { name: 'HiringFinds', cat: 'Job Board', url: 'https://templately.com/pack/hiringfinds-elementor-job-board-template' },
  { name: 'SaaStrive', cat: 'SaaS', url: 'https://templately.com/pack/saastrive-elementor-saas-template' },
];

const CORE_SKILLS = [
  'React & JavaScript',
  'Tailwind CSS',
  'WordPress (Custom Themes)',
  'Shopify Liquid',
  'Elementor / Gutenberg',
];

const ALSO_SKILLS = [
  'TypeScript',
  'Laravel / PHP',
  'Figma (Implementation)',
  'Git & GitHub',
  'Performance Optimization',
];

const LEARNING = [
  'Web Architecture',
  'Shopify Advanced',
  'JavaScript Patterns',
  'UI/UX Fundamentals',
];

const TemplateRow = ({ name, cat, url }) => (
  <a className="template-row" href={url} target="_blank" rel="noopener noreferrer">
    <span className="template-name">{name}</span>
    <span className="template-cat">{cat}</span>
    <i className="ti ti-arrow-up-right template-arrow"></i>
  </a>
);

const Home = () => {
  return (
    <>
      {/* ===== HERO ===== */}
      <FadeIn className="hero" delay={0.05}>
        <h1>MS Zaman</h1>
        <p className="hero-role">
          Frontend Developer <span>·</span> Dhaka, Bangladesh
        </p>
        <p className="hero-bio">
          5+ years building web interfaces across <strong>React</strong>, <strong>Tailwind CSS</strong>,{' '}
          <strong>WordPress</strong>, <strong>Shopify Liquid</strong>, and page builder ecosystems.
          Currently at Startise and contributing to the Templately template library —
          templates I've built are live and used by thousands of WordPress users globally.
        </p>
        <div className="hero-ctas">
          <a href="#work" className="btn btn-primary">
            View Work <i className="ti ti-arrow-right"></i>
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in Touch
          </a>
        </div>
      </FadeIn>

      {/* ===== EXPERIENCE ===== */}
      <FadeIn>
        <section id="experience" className="section">
          <p className="section-label">Experience</p>
          <div className="timeline">
            {EXPERIENCE.map((exp, i) => (
              <div className="tl-item" key={i}>
                <div className={`tl-dot ${exp.current ? 'current' : ''}`}></div>
                <div className="tl-body">
                  <div className="tl-role">{exp.role}</div>
                  <div className="tl-company">{exp.company}</div>
                  <div className="tl-period">{exp.period}</div>
                  {exp.desc && <div className="tl-desc">{exp.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ===== WORK ===== */}
      <FadeIn>
        <section id="work" className="section">
          <p className="section-label">Work</p>

          {/* Templately intro */}
          <p className="template-note">
            I'm part of the <strong>Templately</strong> team where I design and build production-ready
            templates for Elementor and Gutenberg — publicly available on templately.com.
          </p>

          {/* Gutenberg Templates */}
          <div className="template-group">
            <div className="template-group-label">Gutenberg Templates</div>
            <div className="template-list">
              {GUTENBERG_TEMPLATES.map((t) => (
                <TemplateRow key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* Elementor Templates */}
          <div className="template-group">
            <div className="template-group-label">Elementor Templates</div>
            <div className="template-list">
              {ELEMENTOR_TEMPLATES.map((t) => (
                <TemplateRow key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div className="project-list">
            <div className="project-item" style={{ cursor: 'default' }}>
              <div className="project-left">
                <div className="project-name">Hisabee — Web Application</div>
                <div className="project-desc">
                  Frontend implementation for a collaborative web app. Responsive UI, smooth
                  functionality, and clean architecture.
                </div>
                <div className="tech-pills">
                  <span className="tech-pill">HTML</span>
                  <span className="tech-pill">CSS</span>
                  <span className="tech-pill">JavaScript</span>
                </div>
              </div>
              <div className="project-right">
                <span className="project-tag">Web App</span>
                <span className="project-link" style={{ color: 'var(--text-3)' }}>NDA</span>
              </div>
            </div>

            <a className="project-item" href="mailto:dev.mszaman@gmail.com">
              <div className="project-left">
                <div className="project-name">Client Work</div>
                <div className="project-desc">
                  Selected frontend projects across React, Shopify, and WordPress — available on request.
                </div>
                <div className="tech-pills">
                  <span className="tech-pill">React</span>
                  <span className="tech-pill">Tailwind</span>
                  <span className="tech-pill">Shopify</span>
                  <span className="tech-pill">WordPress</span>
                </div>
              </div>
              <div className="project-right">
                <span className="project-tag">Web Development</span>
                <span className="project-link">
                  Ask me <i className="ti ti-arrow-up-right"></i>
                </span>
              </div>
            </a>
          </div>
        </section>
      </FadeIn>

      {/* ===== SKILLS ===== */}
      <FadeIn>
        <section id="skills" className="section">
          <p className="section-label">Skills</p>
          <div className="skills-cols">
            <div>
              <div className="skill-group-title">Core</div>
              <div className="skill-list">
                {CORE_SKILLS.map((s) => (
                  <span className="skill-item" key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="skill-group-title">Also</div>
              <div className="skill-list">
                {ALSO_SKILLS.map((s) => (
                  <span className="skill-item" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ===== CURRENTLY LEARNING ===== */}
      <FadeIn>
        <section className="section">
          <p className="section-label">Currently learning</p>
          <div className="learning-tags">
            {LEARNING.map((tag) => (
              <span className="learn-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ===== CONTACT ===== */}
      <FadeIn>
        <section id="contact" className="section">
          <p className="section-label">Contact</p>
          <div className="contact-grid">
            <a className="contact-item" href="mailto:dev.mszaman@gmail.com">
              <i className="ti ti-mail"></i>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-val">dev.mszaman@gmail.com</div>
              </div>
            </a>
            <a className="contact-item" href="https://www.linkedin.com/in/sharfuzzaman/" target="_blank" rel="noopener noreferrer">
              <i className="ti ti-brand-linkedin"></i>
              <div>
                <div className="contact-label">LinkedIn</div>
                <div className="contact-val">sharfuzzaman</div>
              </div>
            </a>
            <a className="contact-item" href="tel:+8801764121252">
              <i className="ti ti-brand-whatsapp"></i>
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-val">+880 1764 121252</div>
              </div>
            </a>
            <a className="contact-item" href="https://github.com/ms-zaman" target="_blank" rel="noopener noreferrer">
              <i className="ti ti-brand-github"></i>
              <div>
                <div className="contact-label">GitHub</div>
                <div className="contact-val">ms-zaman</div>
              </div>
            </a>
          </div>
          <p className="contact-note">Usually reply within 2 hours.</p>
        </section>
      </FadeIn>
    </>
  );
};

export default Home;
