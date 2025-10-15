'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSeason } from '@/contexts/SeasonContext';

// Particle component for snow, leaves, hearts, etc.
interface ParticleProps {
  type: string;
  style?: React.CSSProperties;
  onComplete: () => void;
  direction?: 'left-to-right' | 'right-to-left'; // For bees and cupid
}

const Particle: React.FC<ParticleProps> = ({ type, style, onComplete, direction }) => {
  const particleRef = useRef<HTMLDivElement>(null);
  const [initialPosition] = useState(() => {
    const isSnow = type === 'snow';
    const isBee = type === 'bee';
    const isHeart = type === 'heart';
    return {
      left: Math.random() * 100,
      // Different durations for different types
      duration: isBee
        ? Math.random() * 3000 + 10000 // Bees: 10-13 seconds (longer to ensure they cross)
        : isHeart
        ? Math.random() * 2000 + 6000 // Hearts: 6-8 seconds (float upward)
        : Math.random() * 1500 + 4000, // Others: 4-5.5 seconds
      // Different size ranges for different types
      size: isSnow
        ? Math.random() * 0.8 + 0.5  // Snow: 0.5-1.3rem (slightly bigger, more varied)
        : isBee
        ? Math.random() * 0.4 + 1.2  // Bees: 1.2-1.6rem (medium size)
        : isHeart
        ? Math.random() * 0.5 + 1.0  // Hearts: 1.0-1.5rem (medium)
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
    
    // Use special flight animations for bees
    if (type === 'bee') {
      // Use the direction prop if provided, otherwise random
      const flyDirection = direction || (Math.random() < 0.5 ? 'left-to-right' : 'right-to-left');
      const flightPattern = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      element.style.animation = `bee-${flyDirection}-${flightPattern} ${initialPosition.duration}ms ease-in-out forwards`;
    } else if (type === 'heart') {
      // Hearts float upward
      element.style.animation = `float-up${initialPosition.animationVariation} ${initialPosition.duration}ms linear forwards`;
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
      case 'egg':
        // Easter eggs
        return '🥚';
      case 'heart':
        // Hearts for Valentine's Day
        return '❤️';
      default:
        return '•';
    }
  };

  // Fix leaf color - use state instead of function to prevent color changes during animation
  const [leafColorStyle] = useState(() => {
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
  });

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
  const { selectedSeason, autoDetectedSeasons } = useSeason();
  // For "all" season, use the first auto-detected season for animations
  const season = selectedSeason === 'all' ? (autoDetectedSeasons[0] || 'spring') : selectedSeason;
  const [particles, setParticles] = useState<Array<{id: number, type: string, direction?: 'left-to-right' | 'right-to-left'}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sunlightEffects, setSunlightEffects] = useState<Array<{
    id: number,
    type: 'ray' | 'sparkle' | 'sweep',
    style: React.CSSProperties
  }>>([]);
  const particleIdRef = useRef(0);


  // Background color calculation - neutral background with seasonal variations
  const getBackgroundStyle = () => {
    if (season === 'winter' || season === 'Christmas') {
      // Darker background with blue tint for winter/Christmas to make snow more visible
      return {
        background: 'linear-gradient(to bottom, #e8eaf0 0%, #d4d8e1 50%, #c0c6d2 100%)'
      };
    }

    // Default neutral background for all other seasons (spring, summer, fall, holidays)
    return {
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
    };
  };


  // Particle generation with global limits - reduce on mobile for performance
  const createParticle = useCallback(() => {
    const shouldCreate = Math.random() < 0.95; // Higher chance for more particles

    if (!shouldCreate) return;

    // Determine particle type and direction based on season
    let particleType = '';
    let direction: 'left-to-right' | 'right-to-left' | undefined = undefined;

    if (season === 'winter' || season === 'Christmas') {
      particleType = 'snow';
    } else if (season === 'fall' || season === 'Halloween' || season === 'Thanksgiving') {
      particleType = 'leaf';
    } else if (season === 'spring') {
      particleType = 'seed';
    } else if (season === 'summer') {
      particleType = 'bee';
    } else if (season === 'Easter') {
      particleType = 'egg';
    } else if (season === 'Valentines') {
      // Only hearts, no cupid (cupid is creepy!)
      particleType = 'heart';
    }

    const newParticle = {
      id: particleIdRef.current++,
      type: particleType,
      direction
    };

    if (newParticle.type) {
      setParticles(prev => {
        const currentParticles = prev;
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        // Type-specific limits
        if (newParticle.type === 'bee') {
          // Strict bee control: exactly 1 going left-to-right and 1 going right-to-left at a time
          const beesLeftToRight = currentParticles.filter(p => p.type === 'bee' && p.direction === 'left-to-right');
          const beesRightToLeft = currentParticles.filter(p => p.type === 'bee' && p.direction === 'right-to-left');

          // Determine which direction this bee should go
          if (beesLeftToRight.length === 0 && beesRightToLeft.length === 0) {
            // No bees active, randomly choose direction
            newParticle.direction = Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
          } else if (beesLeftToRight.length === 0) {
            // Only add left-to-right bee
            newParticle.direction = 'left-to-right';
          } else if (beesRightToLeft.length === 0) {
            // Only add right-to-left bee
            newParticle.direction = 'right-to-left';
          } else {
            // Both directions occupied, don't add
            return currentParticles;
          }
        } else if (newParticle.type === 'snow') {
          const currentSnow = currentParticles.filter(p => p.type === 'snow');
          const maxSnow = isMobile ? 100 : 200; // Double the snow!
          if (currentSnow.length >= maxSnow) {
            return currentParticles;
          }
        } else if (newParticle.type === 'heart') {
          const currentHearts = currentParticles.filter(p => p.type === 'heart');
          const maxHearts = isMobile ? 30 : 60;
          if (currentHearts.length >= maxHearts) {
            return currentParticles;
          }
        } else {
          // Other particle types (leaves, seeds, eggs)
          const currentTypeCount = currentParticles.filter(p => p.type === newParticle.type);
          const maxOther = isMobile ? 25 : 50;
          if (currentTypeCount.length >= maxOther) {
            return currentParticles;
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

  // Generate cross light for Easter only (removed summer laser beams)
  useEffect(() => {
    if (season === 'Easter' && !isTransitioning) {
      // Easter cross light effect
      const generateCrossLight = () => {
        const effects = [];

        // Vertical beam of cross (center of screen)
        effects.push({
          id: 1,
          type: 'ray' as const,
          style: {
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '100vh',
            background: `linear-gradient(to bottom,
              rgba(255, 248, 220, 0.4) 0%,
              rgba(255, 248, 220, 0.5) 20%,
              rgba(255, 248, 220, 0.45) 40%,
              rgba(255, 248, 220, 0.4) 60%,
              rgba(255, 248, 220, 0.3) 80%,
              transparent 100%)`,
            filter: 'blur(2px)',
            boxShadow: `
              0 0 20px rgba(255, 248, 220, 0.3),
              0 0 40px rgba(255, 248, 220, 0.2),
              0 0 60px rgba(255, 248, 220, 0.1)
            `,
            zIndex: 2,
            opacity: 0.6,
            animation: 'cross-glow 8s ease-in-out infinite',
          } as React.CSSProperties
        });

        // Horizontal beam of cross (center height)
        effects.push({
          id: 2,
          type: 'ray' as const,
          style: {
            position: 'absolute',
            top: '30%',
            left: '0',
            width: '100vw',
            height: '150px',
            background: `linear-gradient(to right,
              transparent 0%,
              rgba(255, 248, 220, 0.3) 20%,
              rgba(255, 248, 220, 0.5) 50%,
              rgba(255, 248, 220, 0.3) 80%,
              transparent 100%)`,
            filter: 'blur(2px)',
            boxShadow: `
              0 0 20px rgba(255, 248, 220, 0.3),
              0 0 40px rgba(255, 248, 220, 0.2),
              0 0 60px rgba(255, 248, 220, 0.1)
            `,
            zIndex: 2,
            opacity: 0.6,
            animation: 'cross-glow 8s ease-in-out infinite',
          } as React.CSSProperties
        });

        // Add sparkles around the cross - reduce on mobile
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const sparkleCount = isMobile ? 8 : 15;
        for (let i = 0; i < sparkleCount; i++) {
          // Position sparkles near the cross intersection
          const xOffset = (Math.random() - 0.5) * 30; // ±15% from center
          const yOffset = (Math.random() - 0.5) * 30; // ±15% from center

          effects.push({
            id: i + 100,
            type: 'sparkle' as const,
            style: {
              position: 'absolute',
              left: `${50 + xOffset}%`,
              top: `${30 + yOffset}%`,
              width: '4px',
              height: '4px',
              background: 'radial-gradient(circle, rgba(255, 248, 220, 1) 0%, rgba(255, 248, 220, 0.6) 30%, transparent 70%)',
              borderRadius: '50%',
              '--sparkle-duration': `${Math.random() * 3 + 2}s`,
              '--sparkle-delay': `${Math.random() * 10}s`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 6px rgba(255, 248, 220, 0.8), 0 0 12px rgba(255, 248, 220, 0.4)',
            } as React.CSSProperties
          });
        }

        setSunlightEffects(effects);
      };

      generateCrossLight();

      // Keep the cross light steady
      const interval = setInterval(generateCrossLight, 20000);
      return () => clearInterval(interval);
    } else {
      setSunlightEffects([]);
    }
  }, [season, isTransitioning]);

  // Initial transition - delay more on mobile for better performance
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const delay = isMobile ? transitionDuration + 1000 : transitionDuration; // Extra 1s delay on mobile

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [transitionDuration]);

  // Particle generation interval - different frequencies for different seasons
  // Only generate particles for seasons with specific animations
  useEffect(() => {
    const seasonsWithParticles = ['winter', 'Christmas', 'fall', 'Halloween', 'Thanksgiving', 'spring', 'summer', 'Easter', 'Valentines'];

    // Clear incompatible particles when season changes
    setParticles(prev => {
      // Determine the correct particle types for this season
      const correctTypes = season === 'winter' || season === 'Christmas' ? ['snow']
                        : season === 'fall' || season === 'Halloween' || season === 'Thanksgiving' ? ['leaf']
                        : season === 'spring' ? ['seed']
                        : season === 'summer' ? ['bee']
                        : season === 'Easter' ? ['egg']
                        : season === 'Valentines' ? ['heart']
                        : [];

      // If no animations for this season, clear all particles
      if (!seasonsWithParticles.includes(season)) {
        return [];
      }

      // Filter out particles that don't match the current season
      return prev.filter(p => correctTypes.includes(p.type));
    });

    if (seasonsWithParticles.includes(season) && !isTransitioning) {
      // Different frequencies for each season
      const interval = season === 'winter' || season === 'Christmas'
        ? setInterval(createParticle, 140) // Faster snow for double output (~0.14 seconds)
        : season === 'fall' || season === 'Halloween' || season === 'Thanksgiving'
        ? setInterval(createParticle, 833) // Medium leaves (~0.83 seconds)
        : season === 'spring'
        ? setInterval(createParticle, 1500) // Gentle seeds (~1.5 seconds)
        : season === 'summer'
        ? setInterval(createParticle, 6000) // Bees every 6 seconds (1 left + 1 right at a time, need longer)
        : season === 'Easter'
        ? setInterval(createParticle, 500) // Easter eggs (~0.5 seconds)
        : season === 'Valentines'
        ? setInterval(createParticle, 400) // Hearts (~0.4 seconds)
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

        {/* Easter cross light only */}
        {season === 'Easter' && sunlightEffects.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sunlightEffects.map((effect) => (
              <div
                key={effect.id}
                className={`${effect.type === 'ray' ? 'cross-beam' : 'beam-sparkle'}`}
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
            direction={particle.direction}
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