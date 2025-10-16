'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Lazy load DynamicBackground to reduce initial bundle and blocking time
const DynamicBackground = dynamic(() => import('@/components/DynamicBackground'), {
  ssr: false, // Don't render on server (animations are client-side only)
  loading: () => <div className="fixed inset-0 -z-10 bg-gradient-to-b from-amber-50 to-yellow-50" />, // Placeholder background
});

interface ClientBackgroundProps {
  footerHeight: number;
  className: string;
  transitionDuration: number;
  children: ReactNode;
}

export default function ClientBackground({
  footerHeight,
  className,
  transitionDuration,
  children
}: ClientBackgroundProps) {
  return (
    <DynamicBackground
      footerHeight={footerHeight}
      className={className}
      transitionDuration={transitionDuration}
    >
      {children}
    </DynamicBackground>
  );
}
