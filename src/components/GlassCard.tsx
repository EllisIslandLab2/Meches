'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  intensity = 'medium'
}) => {
  const getGlassStyles = () => {
    switch (intensity) {
      case 'light':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        };
      case 'medium':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        };
      case 'strong':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        };
    }
  };

  const glassStyles = getGlassStyles();

  return (
    <div
      className={`rounded-2xl shadow-2xl ${className}`}
      style={{
        ...glassStyles,
        WebkitBackdropFilter: glassStyles.backdropFilter, // Safari support
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;