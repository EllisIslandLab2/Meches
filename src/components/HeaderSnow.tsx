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
      size: Math.random() * 0.8 + 0.5,  // Snow: 0.5-1.3rem
      animationVariation: Math.floor(Math.random() * 6) + 1,
      rotationSpeed: Math.random() * 2 + 0.5,
      zigzagIntensity: Math.random() * 0.8 + 0.6,
      driftVariation: Math.random() * 20 - 10,
      opacity: Math.random() * 0.4 + 0.6, // Snow: 0.6-1.0
      blurAmount: Math.random() * 1 + 0.5,
      glintDuration: Math.random() * 2 + 1.5,
      glintDelay: Math.random() * 3
    };
  });

  useEffect(() => {
    const element = particleRef.current;
    if (!element) return;

    element.style.willChange = 'transform';
    element.style.setProperty('--rotation-speed', initialPosition.rotationSpeed.toString());
    element.style.setProperty('--zigzag-intensity', initialPosition.zigzagIntensity.toString());
    element.style.setProperty('--drift-variation', `${initialPosition.driftVariation}px`);
    element.style.animation = `fall${initialPosition.animationVariation} ${initialPosition.duration}ms linear forwards`;

    const timer = setTimeout(() => {
      onComplete();
    }, initialPosition.duration);

    return () => clearTimeout(timer);
  }, [onComplete, initialPosition.duration, initialPosition.animationVariation]);

  const snowStyle = {
    color: '#ffffff',
    textShadow: `0 0 ${initialPosition.blurAmount * 2}px rgba(255, 255, 255, 0.8), 0 0 ${initialPosition.blurAmount * 4}px rgba(255, 255, 255, 0.6)`,
    filter: `blur(${initialPosition.blurAmount}px)`,
    opacity: initialPosition.opacity,
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
      ●
    </div>
  );
};

// Header Snow Component - only shows in header area
export default function HeaderSnow() {
  const { selectedSeason } = useSeason();
  const season = selectedSeason;
  const [particles, setParticles] = useState<Array<{id: number, type: string}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const particleIdRef = useRef(0);

  // Particle generation - only snow for Christmas
  const createParticle = useCallback(() => {
    if (season !== 'Christmas') return;

    const shouldCreate = Math.random() < 0.95;
    if (!shouldCreate) return;

    const newParticle = {
      id: particleIdRef.current++,
      type: 'snow'
    };

    setParticles(prev => {
      const currentSnow = prev.filter(p => p.type === 'snow');
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const maxSnow = isMobile ? 30 : 60; // Fewer particles for header only

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

  // Initial transition
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const delay = isMobile ? 1000 : 500;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  // Particle generation interval
  useEffect(() => {
    if (season !== 'Christmas') {
      setParticles([]);
      return;
    }

    if (season === 'Christmas' && !isTransitioning) {
      const interval = setInterval(createParticle, 200); // Slower for header
      return () => clearInterval(interval);
    }
  }, [season, isTransitioning, createParticle]);

  // Only show if Christmas season
  if (season !== 'Christmas') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <Particle
          key={particle.id}
          type={particle.type}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
    </div>
  );
}
