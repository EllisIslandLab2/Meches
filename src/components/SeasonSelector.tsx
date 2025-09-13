'use client';

import React from 'react';
import { useSeason } from '@/contexts/SeasonContext';

const SeasonSelector: React.FC = () => {
  const { selectedSeason, setSelectedSeason, actualSeason } = useSeason();

  const seasons = [
    { value: 'spring', label: 'Spring', emoji: '🌸' },
    { value: 'summer', label: 'Summer', emoji: '☀️' },
    { value: 'fall', label: 'Fall', emoji: '🍂' },
    { value: 'winter', label: 'Winter', emoji: '❄️' }
  ] as const;

  return (
    <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-amber-900 mb-3 text-center">
        Choose Your Season
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {seasons.map((season) => (
          <button
            key={season.value}
            onClick={() => setSelectedSeason(season.value)}
            className={`
              flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200
              ${selectedSeason === season.value
                ? 'bg-amber-200 border-2 border-amber-400 shadow-md scale-105'
                : 'bg-white/70 border border-amber-300 hover:bg-amber-100/80 hover:border-amber-400'
              }
            `}
          >
            <span className="text-xl">{season.emoji}</span>
            <span className={`font-medium ${selectedSeason === season.value ? 'text-amber-900' : 'text-amber-800'}`}>
              {season.label}
            </span>
            {season.value === actualSeason && (
              <span className="text-xs bg-amber-300 text-amber-900 px-2 py-1 rounded-full">
                Current
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-amber-700 text-center mt-2">
        Products will update to match your selected season
      </p>
    </div>
  );
};

export default SeasonSelector;