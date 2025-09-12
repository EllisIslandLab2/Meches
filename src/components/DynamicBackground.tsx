'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom hooks for time and season detection
const useTimeOfDay = () => {
  const [timeData, setTimeData] = useState({
    hour: new Date().getHours(),
    timeOfDay: 'day',
    progress: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let timeOfDay = 'day';
      let progress = 0;
      
      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
        progress = (hour - 6) / 6;
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'day';
        progress = (hour - 12) / 6;
      } else if (hour >= 18 && hour < 21) {
        timeOfDay = 'evening';
        progress = (hour - 18) / 3;
      } else {
        timeOfDay = 'night';
        progress = hour < 6 ? (hour + 6) / 12 : (hour - 18) / 12;
      }
      
      setTimeData({ hour, timeOfDay, progress });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return timeData;
};

const useSeason = () => {
  const [season, setSeason] = useState('spring');

  useEffect(() => {
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
  const [initialPosition] = useState({
    left: Math.random() * 100,
    duration: Math.random() * 1500 + 4000, // 4-5.5 seconds (tighter range)
    size: Math.random() * 0.6 + 1.8,
    animationVariation: Math.floor(Math.random() * 6) + 1, // 1, 2, 3, 4, 5, or 6
    // Add more randomization for unique movements
    rotationSpeed: Math.random() * 2 + 0.5, // 0.5x to 2.5x rotation speed
    zigzagIntensity: Math.random() * 0.8 + 0.6, // 0.6x to 1.4x zigzag intensity
    driftVariation: Math.random() * 20 - 10 // -10px to +10px extra drift variation
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
    
    element.style.animation = `fall${initialPosition.animationVariation} ${initialPosition.duration}ms linear forwards`;
    
    const timer = setTimeout(() => {
      onComplete();
    }, initialPosition.duration);

    return () => clearTimeout(timer);
  }, [onComplete, initialPosition.duration, initialPosition.animationVariation]);

  const getParticleContent = () => {
    switch (type) {
      case 'snow':
        return '❄';
      case 'leaf':
        // Use only maple leaf 🍁 - we'll color it with CSS
        return '🍁';
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

  return (
    <div
      ref={particleRef}
      className="absolute opacity-90 pointer-events-none select-none"
      style={{
        left: `${initialPosition.left}%`, // Use stable initial position
        top: '-20px',
        fontSize: `${initialPosition.size}rem`, // Use stable size
        textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
        transform: 'translateZ(0)',
        backfaceVisibility: 'visible', // Show both sides!
        perspective: '1000px', // Smooth 3D transforms
        transformStyle: 'preserve-3d', // Enable 3D transforms
        ...leafColorStyle, // Apply the color filter
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
  const { timeOfDay, progress, hour } = useTimeOfDay();
  const season = useSeason();
  const [particles, setParticles] = useState<Array<{id: number, type: string}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, left: number, top: number, delay: number, duration: number}>>([]);
  const particleIdRef = useRef(0);

  // Ensure client-side rendering for consistent calculations
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate stable stars for nighttime
  useEffect(() => {
    if (timeOfDay === 'night' && isClient) {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2
      }));
      setStars(newStars);
    } else {
      setStars([]);
    }
  }, [timeOfDay, isClient]);

  // Background color calculation
  const getBackgroundStyle = () => {
    const isNight = timeOfDay === 'night';
    const isEvening = timeOfDay === 'evening';
    
    if (isNight) {
      return {
        background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      };
    } else if (isEvening) {
      return {
        background: 'linear-gradient(to bottom, #ff7b54 0%, #ff9a8b 30%, #ffd3a5 100%)'
      };
    } else if (timeOfDay === 'morning') {
      return {
        background: 'linear-gradient(to bottom, #ffeaa7 0%, #fab1a0 50%, #e17055 100%)'
      };
    } else {
      return {
        background: 'linear-gradient(to bottom, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)'
      };
    }
  };

  // Calculate sun and moon positions based on current hour (client-side only)
  const getSunMoonPosition = (currentHour: number) => {
    if (!isClient) {
      // Return default positions for SSR to avoid hydration mismatch
      return {
        sun: { opacity: 0, transform: 'translate(-200px, 80px)' },
        moon: { opacity: 0, transform: 'translate(-200px, 80px)' }
      };
    }

    // Calculate sun position (6 AM to 6 PM cycle)
    let sunProgress = 0;
    if (currentHour >= 6 && currentHour <= 18) {
      sunProgress = (currentHour - 6) / 12; // 0 to 1 over 12 hours
    } else {
      sunProgress = currentHour < 6 ? -0.2 : 1.2; // Off screen
    }
    
    // Calculate moon position (6 PM to 6 AM cycle) 
    let moonProgress = 0;
    if (currentHour >= 18 || currentHour <= 6) {
      if (currentHour >= 18) {
        moonProgress = (currentHour - 18) / 12; // 6 PM to midnight
      } else {
        moonProgress = 0.5 + (currentHour / 12); // midnight to 6 AM
      }
    } else {
      moonProgress = currentHour < 12 ? -0.2 : 1.2; // Off screen
    }
    
    // Arc calculation: horizontal movement + vertical arc
    const getArcPosition = (progress: number) => {
      const screenWidth = window.innerWidth || 1200;
      const arcHeight = 100; // Height of the arc
      
      // Horizontal: right to left (100% to -100px)
      const x = Math.round(screenWidth * (1 - progress) - 100);
      
      // Vertical: parabolic arc (highest at middle)
      const y = Math.round(80 + arcHeight * Math.sin(progress * Math.PI));
      
      return { x, y };
    };
    
    const sunPos = getArcPosition(sunProgress);
    const moonPos = getArcPosition(moonProgress);
    
    return {
      sun: {
        opacity: sunProgress >= 0 && sunProgress <= 1 ? 1 : 0,
        transform: `translate(${sunPos.x}px, ${sunPos.y}px)`
      },
      moon: {
        opacity: moonProgress >= 0 && moonProgress <= 1 ? 1 : 0,
        transform: `translate(${moonPos.x}px, ${moonPos.y}px)`
      }
    };
  };

  const { sun, moon } = getSunMoonPosition(hour);

  // Particle generation
  const createParticle = useCallback(() => {
    const isNight = timeOfDay === 'night';
    const shouldCreate = Math.random() < (isNight ? 0.6 : 0.8); // More particles at night, even more during day
    
    if (!shouldCreate) return;

    const newParticle = {
      id: particleIdRef.current++,
      type: season === 'winter' ? 'snow' : season === 'fall' ? 'leaf' : ''
    };

    if (newParticle.type) {
      setParticles(prev => [...prev, newParticle]);
    }
  }, [season, timeOfDay]);

  // Remove particle - no accumulation
  const removeParticle = useCallback((particleId: number, type: string) => {
    setParticles(prev => prev.filter(p => p.id !== particleId));
  }, []);

  // Initial transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    return () => clearTimeout(timer);
  }, [transitionDuration]);

  // Particle generation interval - single leaves/snowflakes
  useEffect(() => {
    if ((season === 'winter' || season === 'fall') && !isTransitioning) {
      const interval = setInterval(createParticle, 2500); // Better balance: 2.5 seconds
      return () => clearInterval(interval);
    }
  }, [season, isTransitioning, createParticle]);


  return (
    <>
      <div 
        className={`fixed inset-0 -z-10 transition-all duration-[3000ms] ease-in-out ${className}`}
        style={getBackgroundStyle()}
      >
        {/* Stable stars for night time */}
        {stars.length > 0 && (
          <div className="absolute inset-0">
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute w-1 h-1 bg-white rounded-full opacity-90 animate-pulse shadow-sm"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                  boxShadow: '0 0 2px #fff, 0 0 4px #fff',
                  filter: 'none',
                  willChange: 'opacity',
                  backfaceVisibility: 'hidden'
                }}
              />
            ))}
          </div>
        )}

        {/* Sun */}
        <div
          className="absolute text-7xl transition-all duration-[3000ms] ease-in-out select-none"
          style={{
            opacity: sun.opacity,
            transform: sun.transform,
            textShadow: '3px 3px 0 #ff6b35, -3px -3px 0 #ff6b35, 3px -3px 0 #ff6b35, -3px 3px 0 #ff6b35',
            filter: 'none'
          }}
        >
          ☀️
        </div>

        {/* Moon */}
        <div
          className="absolute text-6xl transition-all duration-[3000ms] ease-in-out select-none"
          style={{
            opacity: moon.opacity,
            transform: moon.transform,
            textShadow: '2px 2px 0 #1a1a2e, -2px -2px 0 #1a1a2e, 2px -2px 0 #1a1a2e, -2px 2px 0 #1a1a2e',
            filter: 'none'
          }}
        >
          🌙
        </div>

        {/* Clouds for summer */}
        {season === 'summer' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute text-5xl opacity-80 select-none"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 10}%`,
                  animation: `drift 20s linear infinite`,
                  animationDelay: `${i * 5}s`,
                  textShadow: '2px 2px 0 #74b9ff, -2px -2px 0 #74b9ff, 2px -2px 0 #74b9ff, -2px 2px 0 #74b9ff',
                  filter: 'none',
                  WebkitTransform: 'translateZ(0)'
                }}
              >
                ☁️
              </div>
            ))}
          </div>
        )}

        {/* Falling particles - sky animations only */}
        {particles.map(particle => (
          <Particle
            key={particle.id}
            type={particle.type}
            onComplete={() => removeParticle(particle.id, particle.type)}
          />
        ))}
      </div>
      
      {/* Content */}
      {children}
    </>
  );
};

export default DynamicBackground;