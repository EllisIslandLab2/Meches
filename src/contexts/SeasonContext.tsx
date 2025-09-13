'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Season = 'all' | 'spring' | 'summer' | 'fall' | 'winter';

interface SeasonContextType {
  selectedSeason: Season;
  setSelectedSeason: (season: Season) => void;
  actualSeason: Season;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

// Get the actual season based on current date
const getActualSeason = (): Season => {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'spring';
  else if (month >= 6 && month <= 8) return 'summer';
  else if (month >= 9 && month <= 11) return 'fall';
  else return 'winter';
};

interface SeasonProviderProps {
  children: ReactNode;
}

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {
  const actualSeason = getActualSeason();
  const [selectedSeason, setSelectedSeason] = useState<Season>('all');

  const value = {
    selectedSeason,
    setSelectedSeason,
    actualSeason
  };

  return (
    <SeasonContext.Provider value={value}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};