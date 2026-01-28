'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// Data structure: Country arrays
const NORDIC_COUNTRIES = ['Sweden', 'Norway', 'Denmark', 'Finland'] as const;
const NA_COUNTRIES = ['USA', 'Canada'] as const;

type Region = 'nordic' | 'na';
type CapSize = 'large' | 'mid' | 'small';

// Country info with flags and API codes
const COUNTRY_INFO: Record<string, { emoji: string; available: boolean; code: 'sweden' | 'canada' | 'usa' | null }> = {
  'Sweden': { emoji: '🇸🇪', available: true, code: 'sweden' },
  'Norway': { emoji: '🇳🇴', available: false, code: null },
  'Denmark': { emoji: '🇩🇰', available: false, code: null },
  'Finland': { emoji: '🇫🇮', available: false, code: null },
  'USA': { emoji: '🇺🇸', available: true, code: 'usa' },
  'Canada': { emoji: '🇨🇦', available: true, code: 'canada' },
};

interface StockSelectorProps {
  onSelect: (countries: ('sweden' | 'canada' | 'usa')[], capSizes: ('large' | 'mid' | 'small')[]) => void;
  isLoading?: boolean;
}

export function StockSelector({ onSelect, isLoading = false }: StockSelectorProps) {
  const [activeRegion, setActiveRegion] = useState<Region>('nordic');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['Sweden']);
  const [selectedCapSizes, setSelectedCapSizes] = useState<CapSize[]>(['large']);

  // When region changes, reset selected countries to first available in that region
  useEffect(() => {
    const availableCountries = activeRegion === 'nordic'
      ? NORDIC_COUNTRIES.filter(c => COUNTRY_INFO[c].available)
      : NA_COUNTRIES.filter(c => COUNTRY_INFO[c].available);
    
    if (availableCountries.length > 0) {
      // Reset to first available country when region changes
      setSelectedCountries([availableCountries[0]]);
    }
  }, [activeRegion]);

  // Convert display country names to API codes and trigger onSelect
  useEffect(() => {
    const availableCountryCodes = selectedCountries
      .filter(c => COUNTRY_INFO[c]?.available && COUNTRY_INFO[c]?.code)
      .map(c => COUNTRY_INFO[c].code) as ('sweden' | 'canada' | 'usa')[];
    
    if (availableCountryCodes.length > 0 && selectedCapSizes.length > 0) {
      onSelect(availableCountryCodes, selectedCapSizes);
    }
  }, [selectedCountries, selectedCapSizes, onSelect]);

  const handleRegionChange = (region: Region) => {
    setActiveRegion(region);
  };

  const handleCountryToggle = (country: string) => {
    if (!COUNTRY_INFO[country]?.available) return;
    
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        // Remove if already selected, but ensure at least one is selected
        const newSelection = prev.filter(c => c !== country);
        return newSelection.length > 0 ? newSelection : prev;
      } else {
        // Add if not selected
        return [...prev, country];
      }
    });
  };

  const handleCapSizeToggle = (capSize: CapSize) => {
    setSelectedCapSizes(prev => {
      if (prev.includes(capSize)) {
        // Remove if already selected, but ensure at least one is selected
        const newSelection = prev.filter(c => c !== capSize);
        return newSelection.length > 0 ? newSelection : prev;
      } else {
        // Add if not selected
        return [...prev, capSize];
      }
    });
  };

  const getCountriesForRegion = () => {
    return activeRegion === 'nordic' ? NORDIC_COUNTRIES : NA_COUNTRIES;
  };

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-4 mb-6">
      {/* SECTION 1: Region Selector (Top) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleRegionChange('nordic')}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
            activeRegion === 'nordic'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Nordic Markets
        </button>
        <button
          onClick={() => handleRegionChange('na')}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
            activeRegion === 'na'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          North America
        </button>
      </div>

      {/* SECTION 2: Country Filter (Middle) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {getCountriesForRegion().map(country => {
          const isSelected = selectedCountries.includes(country);
          const isAvailable = COUNTRY_INFO[country]?.available ?? false;
          
          return (
            <button
              key={country}
              onClick={() => handleCountryToggle(country)}
              disabled={isLoading || !isAvailable}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                isSelected && isAvailable
                  ? 'bg-slate-800 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : isAvailable
                  ? 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  : 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSelected && isAvailable && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              <span>{COUNTRY_INFO[country]?.emoji}</span>
              <span>{country}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 3: Cap Size Filter (Bottom) */}
      <div className="flex flex-wrap gap-2">
        {(['large', 'mid', 'small'] as CapSize[]).map(capSize => {
          const isSelected = selectedCapSizes.includes(capSize);
          const label = capSize === 'large' ? 'Large Cap' : capSize === 'mid' ? 'Mid Cap' : 'Small Cap';
          
          return (
            <button
              key={capSize}
              onClick={() => handleCapSizeToggle(capSize)}
              disabled={isLoading || (selectedCapSizes.length === 1 && isSelected)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-800 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">
            Hämtar data för {selectedCountries.filter(c => COUNTRY_INFO[c]?.available).length}{' '}
            {selectedCountries.filter(c => COUNTRY_INFO[c]?.available).length === 1 ? 'land' : 'länder'}...
          </span>
        </div>
      )}
    </div>
  );
}
