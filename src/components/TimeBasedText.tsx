'use client';

import React from 'react';

// Hook to get current time of day (reused from DynamicBackground)
const useTimeOfDay = () => {
  const [timeData, setTimeData] = React.useState({
    hour: new Date().getHours(),
    timeOfDay: 'day',
    progress: 0
  });

  React.useEffect(() => {
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

interface TimeBasedTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'heading' | 'paragraph';
}

const TimeBasedText: React.FC<TimeBasedTextProps> = ({ 
  children, 
  className = '', 
  variant = 'paragraph' 
}) => {
  const { timeOfDay } = useTimeOfDay();

  const getTextColor = () => {
    switch (timeOfDay) {
      case 'night':
        // Light colors for dark night background
        return variant === 'heading' 
          ? 'text-amber-100' 
          : 'text-amber-200';
      case 'evening':
        // Medium colors for sunset background
        return variant === 'heading' 
          ? 'text-amber-900' 
          : 'text-amber-800';
      case 'morning':
      case 'day':
      default:
        // Dark colors for light day background
        return variant === 'heading' 
          ? 'text-amber-900' 
          : 'text-amber-800';
    }
  };

  const getDropShadow = () => {
    switch (timeOfDay) {
      case 'night':
        // Light text needs dark shadow
        return 'drop-shadow-lg';
      case 'evening':
        return 'drop-shadow-sm';
      case 'morning':
      case 'day':
      default:
        return 'drop-shadow-sm';
    }
  };

  const dynamicClasses = `${getTextColor()} ${getDropShadow()} transition-colors duration-[3000ms] ease-in-out`;
  const allClasses = `${className} ${dynamicClasses}`.trim();

  return (
    <span className={allClasses}>
      {children}
    </span>
  );
};

export default TimeBasedText;