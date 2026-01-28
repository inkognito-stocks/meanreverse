'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterValues {
  activeRegion: 'nordic' | 'na';
  selectedCountries: string[];
  marketCapMin: number; // MSEK
  marketCapMax: number; // MSEK
  minTurnover: number;  // SEK
}

interface StockSelectorProps {
  onFilterChange: (filters: FilterValues) => void;
  isLoading: boolean;
}

const ALL_COUNTRIES = [
  { id: 'sweden', label: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { id: 'norway', label: 'NO', flag: '🇳🇴', name: 'Norway' },
  { id: 'denmark', label: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { id: 'finland', label: 'FI', flag: '🇫🇮', name: 'Finland' },
  { id: 'usa', label: 'US', flag: '🇺🇸', name: 'USA' },
  { id: 'canada', label: 'CA', flag: '🇨🇦', name: 'Canada' },
];

export const StockSelector: React.FC<StockSelectorProps> = ({ onFilterChange, isLoading }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['sweden']);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter state
  const [minTurnover, setMinTurnover] = useState<number>(0);
  const [mcMin, setMcMin] = useState<number>(0);
  const [mcMax, setMcMax] = useState<number>(500000); // Default 500 miljarder MSEK

  // Determine active region based on selected countries
  const activeRegion: 'nordic' | 'na' = selectedCountries.some(c => ['usa', 'canada'].includes(c))
    ? 'na'
    : 'nordic';

  const handleUpdate = () => {
    onFilterChange({
      activeRegion,
      selectedCountries,
      minTurnover,
      marketCapMin: mcMin,
      marketCapMax: mcMax,
    });
  };

  const toggleCountry = (id: string) => {
    setSelectedCountries(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id];
      
      // Ensure at least one country is selected
      if (newSelection.length === 0) {
        return prev;
      }
      
      return newSelection;
    });
  };

  // Apply quick preset
  const applyPreset = (preset: 'small' | 'mid' | 'large') => {
    switch (preset) {
      case 'small':
        setMcMin(0);
        setMcMax(10000); // 0-10B MSEK
        break;
      case 'mid':
        setMcMin(10000);
        setMcMax(100000); // 10B-100B MSEK
        break;
      case 'large':
        setMcMin(100000);
        setMcMax(500000); // 100B+ MSEK
        break;
    }
  };

  // Update filters when state changes
  useEffect(() => {
    handleUpdate();
  }, [selectedCountries, minTurnover, mcMin, mcMax]);

  return (
    <>
      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* Country Selector - Wrapping Layout */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {ALL_COUNTRIES.map((country) => {
              const isActive = selectedCountries.includes(country.id);
              return (
                <button
                  key={country.id}
                  onClick={() => toggleCountry(country.id)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-all min-w-[70px] ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-xs font-medium">{country.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          disabled={isLoading}
          className="flex-shrink-0 p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Öppna filter"
        >
          <SlidersHorizontal className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setShowFilterModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 bg-[#1e293b] border-t border-slate-700 rounded-t-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Filter</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Stäng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Snabbval
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => applyPreset('small')}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Small Cap
                  </button>
                  <button
                    onClick={() => applyPreset('mid')}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Mid Cap
                  </button>
                  <button
                    onClick={() => applyPreset('large')}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Large Cap
                  </button>
                </div>
              </div>

              {/* Market Cap Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Börsvärde (MSEK)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={mcMin}
                    onChange={(e) => setMcMin(Math.max(0, Number(e.target.value)))}
                    disabled={isLoading}
                    placeholder="Min"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-slate-500 text-sm">-</span>
                  <input
                    type="number"
                    value={mcMax}
                    onChange={(e) => setMcMax(Math.max(mcMin, Number(e.target.value)))}
                    disabled={isLoading}
                    placeholder="Max"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Min Turnover */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Min. Omsättning (SEK)
                </label>
                <input
                  type="number"
                  value={minTurnover}
                  onChange={(e) => setMinTurnover(Math.max(0, Number(e.target.value)))}
                  disabled={isLoading}
                  placeholder="0"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Footer Button */}
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Visa Resultat
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
