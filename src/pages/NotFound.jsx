import { Link } from 'react-router-dom';
import { IconArrowRight } from '../components/Icons';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p className="section-label" style={{ marginBottom: '1rem' }}>404</p>
      <h1 style={{
        fontSize: 'clamp(24px, 5vw, 32px)',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        marginBottom: '0.75rem',
        color: 'var(--text)',
      }}>
        Page not found
      </h1>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-2)',
        marginBottom: '2rem',
        lineHeight: 1.6,
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home <IconArrowRight />
      </Link>
    </div>
  );
};

export default NotFound;
