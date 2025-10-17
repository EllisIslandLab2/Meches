'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSeason, type SeasonHoliday } from '@/contexts/SeasonContext';
import Link from 'next/link';

// Memoize static options outside component to prevent recreation
const SEASON_OPTIONS: Array<{ value: SeasonHoliday; label: string; emoji?: string; customElement?: React.ReactNode }> = [
  { value: 'all', label: 'All Products', emoji: '🛍️' },
  { value: 'spring', label: 'Spring', emoji: '🌸' },
  { value: 'summer', label: 'Summer', emoji: '☀️' },
  { value: 'fall', label: 'Fall', emoji: '🍂' },
  { value: 'winter', label: 'Winter', emoji: '❄️' },
  { value: 'Christmas', label: 'Christmas', emoji: '🎄' },
  { value: 'Halloween', label: 'Halloween', emoji: '🎃' },
  { value: 'Thanksgiving', label: 'Thanksgiving', emoji: '🦃' },
  { value: 'Valentines', label: 'Valentines', emoji: '💝' },
  { value: 'Easter', label: 'Easter', emoji: '✟' },
  {
    value: 'Independence',
    label: 'Independence Day',
    customElement: (
      <span className="font-bold text-sm">
        <span style={{ color: '#DC143C' }}>U</span>
        <span style={{ color: '#FFFFFF', textShadow: '0 0 1px #000' }}>S</span>
        <span style={{ color: '#003366' }}>A</span>
      </span>
    )
  }
];

const SeasonDropdown: React.FC = () => {
  const { selectedSeason, setSelectedSeason, autoDetectedSeasons } = useSeason();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get button text based on current selection - memoized
  const selectedOption = useMemo(() =>
    SEASON_OPTIONS.find(opt => opt.value === selectedSeason),
    [selectedSeason]
  );
  const buttonText = selectedOption ? selectedOption.label : 'Select Season';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (seasonValue: SeasonHoliday) => {
    setSelectedSeason(seasonValue);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-700 text-white px-4 py-2 rounded-full font-medium hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg flex items-center gap-2"
      >
        <span className="text-lg">{selectedOption?.customElement || selectedOption?.emoji}</span>
        <div className="flex flex-col items-start">
          {/* Mobile: "Season/" above "Holiday", Desktop: "Seasons & Holidays" */}
          <div className="text-xs font-semibold hidden md:block">Seasons & Holidays</div>
          <div className="text-xs font-semibold md:hidden leading-tight">Season/<br/>Holiday</div>
          <div className="text-sm">{buttonText}</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-amber-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-amber-700 font-medium border-b border-amber-100">
              Select Season/Holiday:
            </div>
            <div className="max-h-96 overflow-y-auto">
              {SEASON_OPTIONS.map((option) => {
                const isSelected = selectedSeason === option.value;
                const isAutoDetected = autoDetectedSeasons.includes(option.value);

                return (
                  <Link
                    key={option.value}
                    href="/#products"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-amber-50 transition-colors cursor-pointer
                      ${isSelected ? 'bg-amber-100 text-amber-900 font-medium' : 'text-amber-800'}
                    `}
                  >
                    <span className="text-lg">{option.customElement || option.emoji}</span>
                    <span className="flex-1 text-left">{option.label}</span>
                    {isAutoDetected && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                    {isSelected && (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="px-4 py-2 text-xs text-amber-600 border-t border-amber-100">
              Products can appear in multiple seasons
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SeasonDropdown);