import FadeIn from '../components/FadeIn';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconMail,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandGithub,
} from '../components/Icons';

const EXPERIENCE = [
  {
    id: 'startise-sr',
    role: 'Frontend Developer',
    company: 'Startise',
    period: 'Sep 2025 – Present · Dhaka',
    desc: 'Building production-grade Elementor and Gutenberg templates for Templately — a template marketplace serving 700K+ WordPress users. Responsibilities include template creation, template review, issue resolution across existing templates, and launching marketing campaigns for Startise.',
    current: true,
  },
  {
    id: 'startise-jr',
    role: 'Jr. Frontend Developer',
    company: 'Startise',
    period: 'Nov 2022 – Sep 2025 · 2 yrs 11 mos · Dhaka',
    desc: 'Designed and shipped 40+ production templates for the Templately library, built custom WordPress themes with responsive layouts, and collaborated with designers to translate Figma mockups into pixel-perfect implementations.',
    current: false,
  },
  {
    id: 'abit',
    role: 'Jr. Frontend Developer',
    company: 'American Best IT — Digital Marketing Agency',
    period: 'Jan 2022 – Oct 2022 · 10 mos · Dhaka',
    desc: 'Built lead-generation websites for US and Canada-based service companies using Jupiter — an internal CMS. Focused on clean code, SEO-friendly architecture, fast page load times, Google PageSpeed optimization, and UX-focused design across 15+ client projects.',
    current: false,
  },
  {
    id: 'technofelia',
    role: 'Jr. Web Developer',
    company: 'Technofelia',
    period: 'Jan 2021 – Oct 2021 · 10 mos · Dhaka',
    desc: 'Worked across multiple projects including Yoda — an online learning platform, and Hisabee (NDA) — a collaborative web application. Also handled Fiverr client orders involving bug fixes for Envato applications, website updates, and end-to-end server configuration and deployment.',
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

const REACT_PROJECTS = [
  {
    id: 'devdash',
    name: 'DevDash — Developer Dashboard',
    status: 'planned',
    desc: 'A real-time developer productivity dashboard that aggregates GitHub activity, Wakatime stats, and coding streaks into a single clean interface. Features dark mode, responsive charts, and GitHub OAuth.',
    tech: ['React', 'React Query', 'Chart.js', 'GitHub API', 'Tailwind CSS'],
  },
  {
    id: 'quickcart',
    name: 'QuickCart — E-commerce Storefront',
    status: 'planned',
    desc: 'A performant headless e-commerce storefront with product filtering, cart management, Stripe checkout, and optimistic UI updates. Demonstrates state management, API integration, and complex UI patterns.',
    tech: ['React', 'React Router', 'Context API', 'Stripe', 'CSS Modules'],
  },
  {
    id: 'markdownlive',
    name: 'MarkdownLive — Collaborative Editor',
    status: 'planned',
    desc: 'A real-time collaborative Markdown editor with live preview, syntax highlighting, export to PDF/HTML, and shareable links. Showcases WebSocket integration, custom hooks, and accessible keyboard shortcuts.',
    tech: ['React', 'WebSocket', 'CodeMirror', 'Custom Hooks', 'Vite'],
  },
];

const CORE_SKILLS = [
  'React & JavaScript',
  'Tailwind CSS',
  'WordPress (Custom Themes)',
  'Shopify Liquid',
  'Elementor / Gutenberg / Framer / Webflow',
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
    <IconArrowUpRight className="template-arrow" />
  </a>
);

const Home = () => {
  return (
    <>
      {/* ===== HERO ===== */}
      <FadeIn className="hero" delay={0.05}>
        <h1>MS Zaman</h1>
        <p className="hero-role">
          Frontend Developer <span aria-hidden="true">·</span> Dhaka, Bangladesh
        </p>
        <p className="hero-bio">
          5+ years building web interfaces across <strong>React</strong>, <strong>Tailwind CSS</strong>,{' '}
          <strong>WordPress</strong>, <strong>Shopify Liquid</strong>, and page builder ecosystems
          including <strong>Elementor</strong>, <strong>Gutenberg</strong>, <strong>Framer</strong>, and <strong>Webflow</strong>.
          Currently at Startise and contributing to the Templately template library —
          templates I&apos;ve built are live and used by thousands of WordPress users globally.
        </p>
        <div className="hero-ctas">
          <a href="#work" className="btn btn-primary">
            View Work <IconArrowRight />
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in Touch
          </a>
        </div>
      </FadeIn>

      {/* ===== EXPERIENCE ===== */}
      <FadeIn>
        <section id="experience" className="section" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="section-label">Experience</h2>
          <div className="timeline">
            {EXPERIENCE.map((exp) => (
              <div className="tl-item" key={exp.id}>
                <div className={`tl-dot ${exp.current ? 'current' : ''}`} aria-hidden="true"></div>
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
        <section id="work" className="section" aria-labelledby="work-heading">
          <h2 id="work-heading" className="section-label">Work</h2>

          {/* Templately intro */}
          <p className="template-note">
            I&apos;m part of the <strong>Templately</strong> team where I design and build production-ready
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
                <div className="project-name">Yoda — Online Learning Platform</div>
                <div className="project-desc">
                  Frontend development for an online learning platform. Built responsive layouts,
                  interactive UI components, and a clean learning experience.
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
                  Ask me <IconArrowUpRight />
                </span>
              </div>
            </a>
          </div>
        </section>
      </FadeIn>

      {/* ===== REACT PROJECTS — BUILD QUEUE ===== */}
      <FadeIn>
        <section id="react-projects" className="section" aria-labelledby="react-heading">
          <h2 id="react-heading" className="section-label">React Projects — Build Queue</h2>
          <p className="build-queue-intro">
            Personal React projects I&apos;m building to sharpen my skills in
            <strong> state management</strong>, <strong>API integration</strong>,
            and <strong>complex UI patterns</strong>. Each project is designed to solve a
            real problem and demonstrate production-quality code.
          </p>
          {REACT_PROJECTS.map((project) => (
            <div className="build-card" key={project.id}>
              <div className="build-card-header">
                <span className="build-card-name">{project.name}</span>
                <span className={`build-card-status ${project.status}`}>
                  {project.status === 'in-progress' ? 'In Progress' : 'Planned'}
                </span>
              </div>
              <div className="build-card-desc">{project.desc}</div>
              <div className="tech-pills">
                {project.tech.map((t) => (
                  <span className="tech-pill" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ===== SKILLS ===== */}
      <FadeIn>
        <section id="skills" className="section" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="section-label">Skills</h2>
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
        <section className="section" aria-labelledby="learning-heading">
          <h2 id="learning-heading" className="section-label">Currently learning</h2>
          <div className="learning-tags">
            {LEARNING.map((tag) => (
              <span className="learn-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ===== CONTACT ===== */}
      <FadeIn>
        <section id="contact" className="section" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="section-label">Contact</h2>
          <div className="contact-grid">
            <a className="contact-item" href="mailto:dev.mszaman@gmail.com">
              <IconMail />
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-val">dev.mszaman@gmail.com</div>
              </div>
            </a>
            <a className="contact-item" href="https://www.linkedin.com/in/sharfuzzaman/" target="_blank" rel="noopener noreferrer">
              <IconBrandLinkedin />
              <div>
                <div className="contact-label">LinkedIn</div>
                <div className="contact-val">sharfuzzaman</div>
              </div>
            </a>
            <a className="contact-item" href="tel:+8801764121252">
              <IconBrandWhatsapp />
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-val">+880 1764 121252</div>
              </div>
            </a>
            <a className="contact-item" href="https://github.com/ms-zaman" target="_blank" rel="noopener noreferrer">
              <IconBrandGithub />
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
