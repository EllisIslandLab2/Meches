'use client';

import { useState, useEffect } from 'react';

type Season = 'spring' | 'summer' | 'fall' | 'winter';

export default function DevSeasonControl() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  useEffect(() => {
    // Only show in development environment
    const isDev = process.env.NODE_ENV === 'development';
    setIsVisible(isDev);

    // Get current override if any
    const savedSeason = localStorage.getItem('devSeason') as Season;
    if (savedSeason) {
      setCurrentSeason(savedSeason);
    }
  }, []);

  const handleSeasonChange = (season: Season | null) => {
    if (season) {
      localStorage.setItem('devSeason', season);
      // Also set URL param for immediate effect
      const url = new URL(window.location.href);
      url.searchParams.set('season', season);
      window.history.replaceState({}, '', url.toString());
    } else {
      localStorage.removeItem('devSeason');
      // Remove URL param to use real season
      const url = new URL(window.location.href);
      url.searchParams.delete('season');
      window.history.replaceState({}, '', url.toString());
    }
    
    setCurrentSeason(season);
    // Reload to apply changes
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-black/80 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-2">🛠️ Dev Season Control</h3>
        <div className="space-y-2">
          <div className="text-xs mb-2">
            Current: {currentSeason || 'Auto (real date)'}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleSeasonChange('spring')}
              className={`px-2 py-1 text-xs rounded ${
                currentSeason === 'spring' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              🌸 Spring
            </button>
            <button
              onClick={() => handleSeasonChange('summer')}
              className={`px-2 py-1 text-xs rounded ${
                currentSeason === 'summer' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              ☀️ Summer
            </button>
            <button
              onClick={() => handleSeasonChange('fall')}
              className={`px-2 py-1 text-xs rounded ${
                currentSeason === 'fall' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              🍁 Fall
            </button>
            <button
              onClick={() => handleSeasonChange('winter')}
              className={`px-2 py-1 text-xs rounded ${
                currentSeason === 'winter' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              ❄️ Winter
            </button>
          </div>
          <button
            onClick={() => handleSeasonChange(null)}
            className="w-full px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
          >
            🔄 Reset (Auto)
          </button>
        </div>
        <div className="text-xs text-gray-300 mt-2">
          Only visible in dev mode
        </div>
      </div>
    </div>
  );
}