import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          maxWidth: '680px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 500,
            color: 'var(--text)',
            marginBottom: '0.75rem',
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-2)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
