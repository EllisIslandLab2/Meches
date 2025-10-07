'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSeason } from '@/contexts/SeasonContext';

// Development season hook for backward compatibility with DevSeasonControl
const useDevSeason = () => {
  const [season, setSeason] = useState('spring');

  useEffect(() => {
    // Check for development season override in localStorage or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const devSeason = urlParams.get('season') || localStorage.getItem('devSeason');
    
    if (devSeason && ['spring', 'summer', 'fall', 'winter'].includes(devSeason)) {
      setSeason(devSeason);
      return;
    }
    
    // Default behavior: use actual date
    const now = new Date();
    const month = now.getMonth() + 1;
    
    if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else if (month >= 9 && month <= 11) setSeason('fall');
    else setSeason('winter');
  }, []);

  return season;
};

// Particle component for snow, leaves, etc.
interface ParticleProps {
  type: string;
  style?: React.CSSProperties;
  onComplete: () => void;
}

const Particle: React.FC<ParticleProps> = ({ type, style, onComplete }) => {
  const particleRef = useRef<HTMLDivElement>(null);
  const [initialPosition] = useState(() => {
    const isSnow = type === 'snow';
    const isBee = type === 'bee';
    return {
      left: Math.random() * 100,
      // Different durations for different types
      duration: isBee 
        ? Math.random() * 3000 + 8000 // Bees: 8-11 seconds (enough time to cross screen)
        : Math.random() * 1500 + 4000, // Others: 4-5.5 seconds
      // Different size ranges for different types
      size: isSnow 
        ? Math.random() * 0.8 + 0.3  // Snow: 0.3-1.1rem (smaller, more varied)
        : isBee
        ? Math.random() * 0.4 + 1.2  // Bees: 1.2-1.6rem (medium size)
        : Math.random() * 0.6 + 1.8, // Leaves/Seeds: 1.8-2.4rem (original)
      animationVariation: Math.floor(Math.random() * 6) + 1, // 1, 2, 3, 4, 5, or 6
      // Add more randomization for unique movements
      rotationSpeed: Math.random() * 2 + 0.5, // 0.5x to 2.5x rotation speed
      zigzagIntensity: Math.random() * 0.8 + 0.6, // 0.6x to 1.4x zigzag intensity
      driftVariation: Math.random() * 20 - 10, // -10px to +10px extra drift variation
      // Snow-specific properties
      opacity: isSnow ? Math.random() * 0.4 + 0.6 : 0.9, // Snow: 0.6-1.0, Others: 0.9
      blurAmount: isSnow ? Math.random() * 1 + 0.5 : 0, // Snow: 0.5-1.5px blur, Others: no blur
      // Glint animation properties
      glintDuration: isSnow ? Math.random() * 2 + 1.5 : 0, // 1.5-3.5 seconds
      glintDelay: isSnow ? Math.random() * 3 : 0 // 0-3 second delay
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
    
    // Use special bee flight animations for bees
    if (type === 'bee') {
      // Randomly choose direction and flight pattern
      const direction = Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
      const flightPattern = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      element.style.animation = `bee-${direction}-${flightPattern} ${initialPosition.duration}ms ease-in-out forwards`;
    } else {
      element.style.animation = `fall${initialPosition.animationVariation} ${initialPosition.duration}ms linear forwards`;
    }
    
    const timer = setTimeout(() => {
      onComplete();
    }, initialPosition.duration);

    return () => clearTimeout(timer);
  }, [onComplete, initialPosition.duration, initialPosition.animationVariation]);

  const getParticleContent = () => {
    switch (type) {
      case 'snow':
        return '●'; // Simple white circle for snow
      case 'leaf':
        // Use only maple leaf 🍁 - we'll color it with CSS
        return '🍁';
      case 'seed':
        // Dandelion seeds for spring
        return '✿';
      case 'bee':
        // Bees for summer
        return '🐝';
      default:
        return '•';
    }
  };

  const getLeafColor = () => {
    if (type !== 'leaf') return {};
    
    // Different autumn colors using CSS filters
    const colors = [
      { filter: 'hue-rotate(0deg) saturate(1.2)' }, // Original red
      { filter: 'hue-rotate(25deg) saturate(1.3) brightness(1.1)' }, // Orange-red
      { filter: 'hue-rotate(45deg) saturate(1.4) brightness(1.2)' }, // Orange
      { filter: 'hue-rotate(15deg) saturate(0.9) brightness(0.9)' }, // Deep red
      { filter: 'hue-rotate(35deg) saturate(1.1) brightness(1.3)' }, // Light orange
      { filter: 'hue-rotate(60deg) saturate(1.2) brightness(1.1)' }, // Yellow-orange
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const leafColorStyle = getLeafColor();

  // Spring seed styling
  const getSeedStyle = () => {
    if (type !== 'seed') return {};
    
    return {
      color: '#ffffff',
      textShadow: `
        0 0 2px rgba(255, 255, 255, 0.8),
        0 0 4px rgba(255, 255, 255, 0.6),
        0 0 6px rgba(240, 248, 255, 0.4)
      `,
      filter: 'blur(0.5px)',
      opacity: Math.random() * 0.3 + 0.7, // 0.7-1.0 opacity
    } as React.CSSProperties;
  };

  // Bee styling for summer
  const getBeeStyle = () => {
    if (type !== 'bee') return {};
    
    return {
      opacity: 0.85,
      filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
    } as React.CSSProperties;
  };

  // Snow-specific styling
  const getSnowStyle = () => {
    if (type !== 'snow') return {};
    
    return {
      color: '#ffffff',
      textShadow: `0 0 ${initialPosition.blurAmount * 2}px rgba(255, 255, 255, 0.8), 0 0 ${initialPosition.blurAmount * 4}px rgba(255, 255, 255, 0.6)`,
      filter: `blur(${initialPosition.blurAmount}px)`,
      opacity: initialPosition.opacity,
      // CSS custom properties for animation
      '--blur-amount': `${initialPosition.blurAmount}px`,
      '--glint-duration': `${initialPosition.glintDuration}s`,
      '--glint-delay': `${initialPosition.glintDelay}s`
    } as React.CSSProperties;
  };

  const snowStyle = getSnowStyle();
  const seedStyle = getSeedStyle();
  const beeStyle = getBeeStyle();

  return (
    <div
      ref={particleRef}
      className={`absolute pointer-events-none select-none ${
        type === 'snow' ? 'opacity-100 snowflake-glint' : 
        type === 'seed' ? 'opacity-90' : 
        type === 'bee' ? 'opacity-85' : 'opacity-90'
      }`}
      style={{
        // Let CSS animations handle bee positioning completely, others start from top
        ...(type !== 'bee' && { 
          left: `${initialPosition.left}%`,
          top: '-20px'
        }),
        fontSize: `${initialPosition.size}rem`, // Use stable size
        textShadow: type === 'snow' 
          ? snowStyle.textShadow 
          : type === 'seed'
          ? seedStyle.textShadow
          : type === 'bee'
          ? '1px 1px 2px rgba(0,0,0,0.3)'
          : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
        // Don't interfere with CSS animations for bees
        transform: type === 'bee' ? 'none' : 'translateZ(0)',
        backfaceVisibility: 'visible', // Show both sides!
        perspective: type === 'bee' ? 'none' : '1000px', // Smooth 3D transforms
        transformStyle: type === 'bee' ? 'flat' : 'preserve-3d', // Enable 3D transforms
        ...leafColorStyle, // Apply the color filter for leaves
        ...snowStyle, // Apply snow styling
        ...seedStyle, // Apply seed styling
        ...beeStyle, // Apply bee styling
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
  const season = selectedSeason;
  const [particles, setParticles] = useState<Array<{id: number, type: string}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sunlightEffects, setSunlightEffects] = useState<Array<{
    id: number, 
    type: 'ray' | 'sparkle' | 'sweep',
    style: React.CSSProperties
  }>>([]);
  const particleIdRef = useRef(0);


  // Background color calculation - neutral background with seasonal variations
  const getBackgroundStyle = () => {
    if (season === 'winter') {
      // Darker background with blue tint for winter to make snow more visible
      return {
        background: 'linear-gradient(to bottom, #e8eaf0 0%, #d4d8e1 50%, #c0c6d2 100%)'
      };
    }
    
    // Default neutral background for all other seasons (spring, summer, fall)
    return {
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
    };
  };


  // Particle generation
  const createParticle = useCallback(() => {
    const shouldCreate = Math.random() < 0.95; // Higher chance for more particles
    
    if (!shouldCreate) return;

    const newParticle = {
      id: particleIdRef.current++,
      type: season === 'winter' ? 'snow' : 
            season === 'fall' ? 'leaf' : 
            season === 'spring' ? 'seed' : 
            season === 'summer' ? 'bee' : ''
    };

    if (newParticle.type) {
      setParticles(prev => {
        const currentParticles = prev;
        // Limit bees to max 3 on screen at once to prevent disappearing
        if (newParticle.type === 'bee') {
          const currentBees = currentParticles.filter(p => p.type === 'bee');
          if (currentBees.length >= 3) {
            return currentParticles; // Don't add more bees
          }
        }
        return [...currentParticles, newParticle];
      });
    }
  }, [season]);

  // Remove particle - no accumulation
  const removeParticle = useCallback((particleId: number) => {
    setParticles(prev => prev.filter(p => p.id !== particleId));
  }, []);

  // Generate laser beam effects for summer
  useEffect(() => {
    if (season === 'summer' && !isTransitioning) {
      const generateLaserBeams = () => {
        const effects = [];
        
        // Define a common origin point just inside top-right corner (hidden by header)
        const originX = 100; // Shifted 10 units further to the right
        const originY = -25; // Higher up - 30 units above previous position
        
        // Generate mystical sunbeams (3-4 beams) from single off-screen origin
        const beamCount = Math.floor(Math.random() * 2) + 3;
        const beamPaths = []; // Store beam paths for sparkle positioning
        
        for (let i = 0; i < beamCount; i++) {
          // Closer to vertical but still slightly angled
          const angle = 15 + (i * 5); // 15°, 20°, 25°, 30° - close to vertical but still angled
          
          // Calculate where this beam travels across screen for sparkle positioning
          const beamPath = {
            startX: originX,
            startY: originY,
            angle: angle,
            id: i
          };
          beamPaths.push(beamPath);
          
          effects.push({
            id: i,
            type: 'ray' as const,
            style: {
              position: 'absolute',
              top: `${originY}%`,
              right: `${100 - originX}%`, // Position inside screen at top-right
              width: '120px', // Wider for softer appearance
              height: '250vh', // Extra long to ensure full coverage
              background: `linear-gradient(to bottom, 
                transparent 0%,
                rgba(255, 255, 255, 0.4) 5%,
                rgba(255, 255, 255, 0.5) 15%,
                rgba(255, 255, 255, 0.4) 30%,
                rgba(255, 255, 255, 0.35) 50%,
                rgba(255, 255, 255, 0.3) 70%,
                rgba(255, 255, 255, 0.2) 85%,
                rgba(255, 255, 255, 0.1) 95%,
                transparent 100%)`,
              transformOrigin: 'top center',
              transform: `rotate(${angle}deg) translateX(${i * 25}px)`,
              // Correct widening: narrow at origin (top), wide at end (bottom)
              clipPath: `polygon(48% 0%, 52% 0%, 25% 100%, 75% 100%)`,
              '--beam-rotation': `rotate(${angle}deg)`, // Store rotation for animations
              '--emerge-duration': `${Math.random() * 4 + 8}s`, // 8-12 second cycles (much faster)
              '--shift-duration': `${Math.random() * 6 + 12}s`, // Still slow but not crazy slow
              '--emerge-delay': `${Math.random() * 6}s`, // Shorter delays so you see them sooner
              '--shift-delay': `${Math.random() * 4}s`,
              filter: 'blur(1px)', // Slight blur for softer effect
              boxShadow: `
                0 0 15px rgba(255, 255, 255, 0.2),
                0 0 30px rgba(255, 255, 255, 0.12),
                0 0 45px rgba(255, 255, 255, 0.08)
              `,
              zIndex: 2,
              opacity: 0.7, // Reduced opacity for subtlety
            } as React.CSSProperties
          });
        }
        
        // Generate sparkles positioned specifically around beam paths
        const sparkleCount = Math.floor(Math.random() * 12) + 8;
        for (let i = 0; i < sparkleCount; i++) {
          // Pick a random beam to associate this sparkle with
          const beamIndex = Math.floor(Math.random() * beamPaths.length);
          const beam = beamPaths[beamIndex];
          
          // Calculate sparkle position along the beam path
          const distanceAlongBeam = Math.random(); // 0-1 along beam length
          const sideOffset = (Math.random() - 0.5) * 60; // ±30px from beam center
          
          // Convert beam path to screen coordinates (approximate)
          const beamScreenX = 85 - (distanceAlongBeam * 60); // Approximate beam crossing
          const beamScreenY = 10 + (distanceAlongBeam * 70); // Approximate beam descent
          
          effects.push({
            id: i + 1000, // Offset sparkle IDs to avoid conflicts
            type: 'sparkle' as const,
            style: {
              position: 'absolute',
              left: `${beamScreenX + (sideOffset * 0.3)}%`,
              top: `${beamScreenY}%`,
              width: '3px',
              height: '3px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 30%, transparent 70%)',
              borderRadius: '50%',
              '--sparkle-duration': `${Math.random() * 3 + 2}s`, // 2-5 second sparkles
              '--sparkle-delay': `${Math.random() * 15}s`, // Long delays for mystical effect
              filter: 'blur(0.3px)',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
            } as React.CSSProperties
          });
        }
        
        setSunlightEffects(effects);
      };
      
      generateLaserBeams();
      
      // Regenerate effects periodically for variation
      const interval = setInterval(generateLaserBeams, 15000); // Every 15 seconds
      return () => clearInterval(interval);
    } else {
      setSunlightEffects([]);
    }
  }, [season, isTransitioning]);

  // Initial transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    return () => clearTimeout(timer);
  }, [transitionDuration]);

  // Particle generation interval - different frequencies for different seasons
  useEffect(() => {
    if ((season === 'winter' || season === 'fall' || season === 'spring' || season === 'summer') && !isTransitioning) {
      // Different frequencies for each season
      const interval = season === 'winter' 
        ? setInterval(createParticle, 280) // Fast snow (~0.28 seconds)
        : season === 'fall' 
        ? setInterval(createParticle, 833) // Medium leaves (~0.83 seconds)
        : season === 'spring'
        ? setInterval(createParticle, 1500) // Gentle seeds (~1.5 seconds)
        : season === 'summer'
        ? setInterval(createParticle, 6000) // Rare bees (~6 seconds)
        : setInterval(createParticle, 1000); // Default
      return () => clearInterval(interval);
    }
  }, [season, isTransitioning, createParticle]);


  return (
    <>
      <div 
        className={`fixed inset-0 -z-10 transition-all duration-[3000ms] ease-in-out ${className}`}
        style={getBackgroundStyle()}
      >

        {/* Summer laser beam effects */}
        {season === 'summer' && sunlightEffects.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sunlightEffects.map((effect) => (
              <div
                key={effect.id}
                className={`${effect.type === 'ray' ? 'laser-beam' : 'beam-sparkle'}`}
                style={effect.style}
              />
            ))}
          </div>
        )}

        {/* Falling particles - sky animations only */}
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