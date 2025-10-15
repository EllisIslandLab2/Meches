'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SeasonHoliday = 'spring' | 'summer' | 'fall' | 'winter' | 'Christmas' | 'Halloween' | 'Thanksgiving' | 'Valentine\'s Day' | 'Easter' | 'Independence' | 'all';

interface SeasonContextType {
  selectedSeason: SeasonHoliday;
  setSelectedSeason: (season: SeasonHoliday) => void;
  autoDetectedSeasons: SeasonHoliday[];
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

// Get the actual season and upcoming holidays based on current date
const getAutoDetectedSeasons = (): SeasonHoliday[] => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  const detected: SeasonHoliday[] = [];

  // Add current season
  if (month >= 3 && month <= 5) detected.push('spring');
  else if (month >= 6 && month <= 8) detected.push('summer');
  else if (month >= 9 && month <= 11) detected.push('fall');
  else detected.push('winter');

  // Add holidays that are within 30 days (before or after)
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  // Christmas (Dec 25) - day ~359
  const christmasDay = 359;
  if (Math.abs(dayOfYear - christmasDay) <= 30 || dayOfYear <= 15) detected.push('Christmas');

  // Halloween (Oct 31) - day ~304
  const halloweenDay = 304;
  if (Math.abs(dayOfYear - halloweenDay) <= 30) detected.push('Halloween');

  // Thanksgiving (4th Thursday of November, ~day 327-333)
  if (month === 11 || (month === 10 && day > 15)) detected.push('Thanksgiving');

  // Valentine's Day (Feb 14) - day ~45
  const valentinesDay = 45;
  if (Math.abs(dayOfYear - valentinesDay) <= 30) detected.push('Valentine\'s Day');

  // Easter (varies, roughly March 22 - April 25, ~day 81-115)
  if ((month === 3 && day >= 22) || (month === 4 && day <= 25)) detected.push('Easter');

  // Independence Day (July 4) - day ~185
  const independenceDay = 185;
  if (Math.abs(dayOfYear - independenceDay) <= 30) detected.push('Independence');

  return detected;
};

interface SeasonProviderProps {
  children: ReactNode;
}

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {
  const autoDetectedSeasons = getAutoDetectedSeasons();
  // Default to first auto-detected season, or 'all' if none detected
  const [selectedSeason, setSelectedSeason] = useState<SeasonHoliday>(autoDetectedSeasons[0] || 'all');

  const value = {
    selectedSeason,
    setSelectedSeason,
    autoDetectedSeasons
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