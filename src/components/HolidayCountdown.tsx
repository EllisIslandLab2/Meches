'use client';

import React, { useState, useEffect } from 'react';
import { useSeason, type SeasonHoliday } from '@/contexts/SeasonContext';

// Define holiday dates (day of year)
const holidayDates: Record<string, { dayOfYear: number; name: string; emoji: string }> = {
  'Valentines': { dayOfYear: 45, name: 'Valentine\'s Day', emoji: '💝' },
  'Easter': { dayOfYear: 95, name: 'Easter', emoji: '✟' }, // Approximate
  'Independence': { dayOfYear: 185, name: 'Independence Day', emoji: '🎆' },
  'Halloween': { dayOfYear: 304, name: 'Halloween', emoji: '🎃' },
  'Thanksgiving': { dayOfYear: 330, name: 'Thanksgiving', emoji: '🦃' }, // Approximate
  'Christmas': { dayOfYear: 359, name: 'Christmas', emoji: '🎄' },
};

const HolidayCountdown: React.FC = () => {
  const { autoDetectedSeasons } = useSeason();
  const [countdown, setCountdown] = useState<{ holiday: string; days: number; emoji: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const currentDayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

    // Find the next upcoming holiday from autoDetectedSeasons
    let closestHoliday: { holiday: string; days: number; emoji: string } | null = null;
    let smallestDiff = Infinity;

    autoDetectedSeasons.forEach((season: SeasonHoliday) => {
      if (season === 'all' || season === 'spring' || season === 'summer' || season === 'fall' || season === 'winter') {
        return; // Skip non-holiday seasons
      }

      const holidayInfo = holidayDates[season];
      if (!holidayInfo) return;

      let daysUntil = holidayInfo.dayOfYear - currentDayOfYear;

      // Handle year wrap-around (e.g., if we're in December and next holiday is in January)
      if (daysUntil < 0) {
        const daysInYear = new Date(now.getFullYear(), 11, 31).getDate() === 31 ? 365 : 366;
        daysUntil = daysInYear + daysUntil;
      }

      // Only show countdowns for holidays within 30 days
      if (daysUntil >= 0 && daysUntil <= 30 && daysUntil < smallestDiff) {
        smallestDiff = daysUntil;
        closestHoliday = {
          holiday: holidayInfo.name,
          days: daysUntil,
          emoji: holidayInfo.emoji
        };
      }
    });

    setCountdown(closestHoliday);
  }, [autoDetectedSeasons]);

  if (!countdown || countdown.days === 0) {
    return null; // Don't show countdown if no holiday is upcoming or it's today
  }

  return (
    <div className="text-center">
      <div
        className="inline-block rounded-xl px-6 py-3"
        style={{
          background: 'linear-gradient(to right, rgba(254, 243, 199, 0.6), rgba(254, 249, 195, 0.6))',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)'
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{countdown.emoji}</span>
          <div className="text-left">
            <div className="text-sm font-semibold text-amber-700">Countdown to {countdown.holiday}</div>
            <div className="text-2xl font-bold text-amber-900">
              {countdown.days} {countdown.days === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCountdown;
