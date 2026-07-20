import { Component, type ReactNode } from 'react';

/**
 * Renders nothing if a child throws — most importantly if WebGL context creation
 * fails (unsupported GPU, too many live contexts, driver crash). The <Canvas>
 * unmounts, `.sky-webgl` is never set on the hero, and the CSS photo poster
 * behind the island stays as the fallback. No red console crash for the visitor.
 */
export class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
