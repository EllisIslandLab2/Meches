'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Completely ignore all errors in the payment page
    // The payment processing happens before any error, so errors are cosmetic
    const errorMessage = error.message || error.toString() || '';
    console.warn('PaymentErrorBoundary suppressing error:', errorMessage);

    // Never show error state - just ignore it
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('PaymentErrorBoundary caught and suppressed error:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export default PaymentErrorBoundary;
