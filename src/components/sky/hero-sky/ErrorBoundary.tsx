import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Fired once when a child throws. The hero needs this: rendering null is right,
   * but the island must also stop claiming the sky is WebGL — otherwise `.sky-webgl`
   * stays on (hiding the poster's clouds and glow and switching its scrim off) and
   * the visitor is left with a stripped hero rather than the photo poster.
   */
  onError?: () => void;
}

/**
 * Renders nothing if a child throws — most importantly if WebGL context creation
 * fails (unsupported GPU, too many live contexts, driver crash). The <Canvas>
 * unmounts, `.sky-webgl` is never set on the hero, and the CSS photo poster
 * behind the island stays as the fallback. No red console crash for the visitor.
 */
export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
