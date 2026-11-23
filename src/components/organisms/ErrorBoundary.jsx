import { Component } from 'react';
import Button from '../atoms/Button';

/** Catches render errors in a subtree so one broken page can't blank the whole app. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook for a real error-reporting service (Sentry, etc.)
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto mt-16 max-w-md rounded-2xl border border-danger-line bg-danger-soft p-8 text-center">
        <h2 className="text-lg font-extrabold text-danger-ink">This page hit a problem</h2>
        <p className="mt-2 text-sm text-danger-ink">The rest of the app is still working. You can retry, or head back to the dashboard.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={this.reset}>
            Try again
          </Button>
          <Button as="a" href="/">
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}
