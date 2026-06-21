import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'An unexpected error occurred.';
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center fade-in">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-palepink mb-2">Something went wrong</h1>
            <p className="text-gray-400 dark:text-palepink/50 mb-4">{msg}</p>
            <p className="text-xs text-gray-500 dark:text-palepink/30 mb-4 max-w-md mx-auto break-all">{this.state.error?.stack?.split('\n').slice(0,3).join(' | ')}</p>
            <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-lavender to-peach text-navy px-6 py-2.5 font-semibold rounded-xl text-sm shadow-md btn-premium">
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
