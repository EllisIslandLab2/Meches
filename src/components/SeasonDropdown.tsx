'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSeason, type SeasonHoliday } from '@/contexts/SeasonContext';
import Link from 'next/link';

const SeasonDropdown: React.FC = () => {
  const { selectedSeason, setSelectedSeason, autoDetectedSeasons } = useSeason();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: Array<{ value: SeasonHoliday; label: string; emoji: string }> = [
    { value: 'all', label: 'All Products', emoji: '🛍️' },
    { value: 'spring', label: 'Spring', emoji: '🌸' },
    { value: 'summer', label: 'Summer', emoji: '☀️' },
    { value: 'fall', label: 'Fall', emoji: '🍂' },
    { value: 'winter', label: 'Winter', emoji: '❄️' },
    { value: 'Christmas', label: 'Christmas', emoji: '🎄' },
    { value: 'Halloween', label: 'Halloween', emoji: '🎃' },
    { value: 'Thanksgiving', label: 'Thanksgiving', emoji: '🦃' },
    { value: 'Columbus', label: 'Columbus Day', emoji: '🗽' },
    { value: 'Easter', label: 'Easter', emoji: '🐰' },
    { value: 'Independence', label: 'Independence Day', emoji: '🎆' }
  ];

  // Get button text based on current selection
  const selectedOption = options.find(opt => opt.value === selectedSeason);
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
        className="text-amber-900 font-medium hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 flex items-center gap-2"
      >
        <span>{buttonText}</span>
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
              {options.map((option) => {
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
                    <span className="text-lg">{option.emoji}</span>
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

export default SeasonDropdown;