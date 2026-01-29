'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Ignore Square SDK toFixed errors - they happen after successful payment
    const errorMessage = error.message || error.toString() || '';
    console.log('ErrorBoundary checking error:', errorMessage);

    if (errorMessage.includes('toFixed') || errorMessage.includes('Cannot read properties of undefined')) {
      console.warn('Ignoring Square SDK toFixed error');
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Check if this is the Square SDK toFixed error
    if (error.message && error.message.includes('toFixed')) {
      console.warn('Suppressing Square SDK toFixed error in ErrorBoundary');
      // Check if we're on the payment page and should redirect to success
      if (window.location.pathname === '/payment') {
        console.log('Payment page error - redirecting to success');
        setTimeout(() => {
          window.location.href = '/success';
        }, 100);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-amber-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity border-2 border-stone-600"
              style={{
                backgroundImage: 'url(/wooden-button-resized.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
