'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSeason } from '@/contexts/SeasonContext';

// Particle component for snow only
interface ParticleProps {
  type: string;
  style?: React.CSSProperties;
  onComplete: () => void;
}

const Particle: React.FC<ParticleProps> = ({ type, style, onComplete }) => {
  const particleRef = useRef<HTMLDivElement>(null);
  const [initialPosition] = useState(() => {
    return {
      left: Math.random() * 100,
      duration: Math.random() * 1500 + 4000, // 4-5.5 seconds
      size: Math.random() * 0.8 + 0.5,  // Snow: 0.5-1.3rem (slightly bigger, more varied)
      animationVariation: Math.floor(Math.random() * 6) + 1, // 1, 2, 3, 4, 5, or 6
      rotationSpeed: Math.random() * 2 + 0.5, // 0.5x to 2.5x rotation speed
      zigzagIntensity: Math.random() * 0.8 + 0.6, // 0.6x to 1.4x zigzag intensity
      driftVariation: Math.random() * 20 - 10, // -10px to +10px extra drift variation
      opacity: Math.random() * 0.4 + 0.6, // Snow: 0.6-1.0
      blurAmount: Math.random() * 1 + 0.5, // Snow: 0.5-1.5px blur
      glintDuration: Math.random() * 2 + 1.5, // 1.5-3.5 seconds
      glintDelay: Math.random() * 3 // 0-3 second delay
    };
  });

  useEffect(() => {
    const element = particleRef.current;
    if (!element) return;

    // Set initial position and prevent any layout shifts
    element.style.willChange = 'transform';

    // Apply randomized animation with custom properties
    element.style.setProperty('--rotation-speed', initialPosition.rotationSpeed.toString());
    element.style.setProperty('--zigzag-intensity', initialPosition.zigzagIntensity.toString());
    element.style.setProperty('--drift-variation', `${initialPosition.driftVariation}px`);

    // Snow fall animation
    element.style.animation = `fall${initialPosition.animationVariation} ${initialPosition.duration}ms linear forwards`;

    const timer = setTimeout(() => {
      onComplete();
    }, initialPosition.duration);

    return () => clearTimeout(timer);
  }, [onComplete, initialPosition.duration, initialPosition.animationVariation]);

  const getParticleContent = () => {
    return '●'; // Simple white circle for snow
  };

  // Snow-specific styling
  const snowStyle = {
    color: '#ffffff',
    textShadow: `0 0 ${initialPosition.blurAmount * 2}px rgba(255, 255, 255, 0.8), 0 0 ${initialPosition.blurAmount * 4}px rgba(255, 255, 255, 0.6)`,
    filter: `blur(${initialPosition.blurAmount}px)`,
    opacity: initialPosition.opacity,
    // CSS custom properties for animation
    '--blur-amount': `${initialPosition.blurAmount}px`,
    '--glint-duration': `${initialPosition.glintDuration}s`,
    '--glint-delay': `${initialPosition.glintDelay}s`
  } as React.CSSProperties;

  return (
    <div
      ref={particleRef}
      className="absolute pointer-events-none select-none opacity-100 snowflake-glint"
      style={{
        left: `${initialPosition.left}%`,
        top: '-20px',
        fontSize: `${initialPosition.size}rem`,
        textShadow: snowStyle.textShadow,
        transform: 'translateZ(0)',
        backfaceVisibility: 'visible',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...snowStyle,
        ...style
      }}
    >
      {getParticleContent()}
    </div>
  );
};

// Removed Flower component - no longer needed

// Main Dynamic Background Component
interface DynamicBackgroundProps {
  footerHeight?: number;
  className?: string;
  children: React.ReactNode;
  transitionDuration?: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  footerHeight = 80,
  className = '',
  children,
  transitionDuration = 3000
}) => {
  const { selectedSeason } = useSeason();
  // Only show snow for Christmas season
  const season = selectedSeason;
  const [particles, setParticles] = useState<Array<{id: number, type: string}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const particleIdRef = useRef(0);


  // Background color calculation
  const getBackgroundStyle = () => {
    if (season === 'Christmas') {
      // Darker background with blue tint for Christmas to make snow more visible
      return {
        background: 'linear-gradient(to bottom, #e8eaf0 0%, #d4d8e1 50%, #c0c6d2 100%)'
      };
    }

    // Default neutral background for all other holidays
    return {
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
    };
  };


  // Particle generation - only snow for Christmas
  const createParticle = useCallback(() => {
    // Only create snow particles for Christmas
    if (season !== 'Christmas') return;

    const shouldCreate = Math.random() < 0.95; // Higher chance for more particles
    if (!shouldCreate) return;

    const newParticle = {
      id: particleIdRef.current++,
      type: 'snow'
    };

    setParticles(prev => {
      const currentSnow = prev.filter(p => p.type === 'snow');
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const maxSnow = isMobile ? 60 : 120;

      if (currentSnow.length >= maxSnow) {
        return prev;
      }

      return [...prev, newParticle];
    });
  }, [season]);

  // Remove particle
  const removeParticle = useCallback((particleId: number) => {
    setParticles(prev => prev.filter(p => p.id !== particleId));
  }, []);

  // Initial transition - delay more on mobile for better performance
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const delay = isMobile ? transitionDuration + 1000 : transitionDuration; // Extra 1s delay on mobile

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [transitionDuration]);

  // Particle generation interval - only for Christmas snow
  useEffect(() => {
    // Clear particles when season changes
    if (season !== 'Christmas') {
      setParticles([]);
      return;
    }

    // Only generate snow particles for Christmas
    if (season === 'Christmas' && !isTransitioning) {
      const interval = setInterval(createParticle, 140); // Faster snow (~0.14 seconds)
      return () => clearInterval(interval);
    }
  }, [season, isTransitioning, createParticle]);


  return (
    <>
      <div
        className={`fixed inset-0 -z-10 transition-all duration-[3000ms] ease-in-out ${className}`}
        style={getBackgroundStyle()}
      >
        {/* Snow particles for Christmas only */}
        {particles.map(particle => (
          <Particle
            key={particle.id}
            type={particle.type}
            onComplete={() => removeParticle(particle.id)}
          />
        ))}
      </div>

      {/* Content */}
      {children}
    </>
  );
};

export default DynamicBackground;