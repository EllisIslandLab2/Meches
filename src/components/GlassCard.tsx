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
          background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.3), rgba(254, 252, 191, 0.2))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(217, 119, 6, 0.2)'
        };
      case 'medium':
        return {
          background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.5), rgba(254, 252, 191, 0.4))',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(217, 119, 6, 0.3)'
        };
      case 'strong':
        return {
          background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.7), rgba(254, 252, 191, 0.6))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(217, 119, 6, 0.4)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.5), rgba(254, 252, 191, 0.4))',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(217, 119, 6, 0.3)'
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