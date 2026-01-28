import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

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

const NORDIC_COUNTRIES = [
  { id: 'sweden', label: 'Sweden', flag: '🇸🇪' },
  { id: 'norway', label: 'Norway', flag: '🇳🇴' },
  { id: 'denmark', label: 'Denmark', flag: '🇩🇰' },
  { id: 'finland', label: 'Finland', flag: '🇫🇮' },
];

const NA_COUNTRIES = [
  { id: 'usa', label: 'USA', flag: '🇺🇸' },
  { id: 'canada', label: 'Canada', flag: '🇨🇦' },
];

export const StockSelector: React.FC<StockSelectorProps> = ({ onFilterChange, isLoading }) => {
  const [activeRegion, setActiveRegion] = useState<'nordic' | 'na'>('nordic');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['sweden']);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Numeric Filters State
  const [minTurnover, setMinTurnover] = useState<number>(0);
  const [mcMin, setMcMin] = useState<number>(0);
  const [mcMax, setMcMax] = useState<number>(500000); // Default 500 miljarder

  const handleUpdate = (
    newRegion = activeRegion, 
    newCountries = selectedCountries,
    newTurnover = minTurnover,
    newMcMin = mcMin,
    newMcMax = mcMax
  ) => {
    onFilterChange({
      activeRegion: newRegion,
      selectedCountries: newCountries,
      minTurnover: newTurnover,
      marketCapMin: newMcMin,
      marketCapMax: newMcMax
    });
  };

  const toggleCountry = (id: string) => {
    const newSelection = selectedCountries.includes(id)
      ? selectedCountries.filter(c => c !== id)
      : [...selectedCountries, id];
    
    setSelectedCountries(newSelection);
    handleUpdate(activeRegion, newSelection);
  };

  const switchRegion = (region: 'nordic' | 'na') => {
    setActiveRegion(region);
    const defaultCountry = region === 'nordic' ? ['sweden'] : ['usa'];
    setSelectedCountries(defaultCountry);
    handleUpdate(region, defaultCountry);
  };

  const availableCountries = activeRegion === 'nordic' ? NORDIC_COUNTRIES : NA_COUNTRIES;

  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 mb-6 shadow-sm">
      {/* 1. Region Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => switchRegion('nordic')}
          className={`py-3 px-4 rounded-lg font-bold text-sm transition-all ${
            activeRegion === 'nordic' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          }`}
        >
          Nordic Markets
        </button>
        <button
          onClick={() => switchRegion('na')}
          className={`py-3 px-4 rounded-lg font-bold text-sm transition-all ${
            activeRegion === 'na' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          }`}
        >
          North America
        </button>
      </div>

      {/* 2. Country Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableCountries.map((country) => {
          const isActive = selectedCountries.includes(country.id);
          return (
            <button
              key={country.id}
              onClick={() => toggleCountry(country.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? 'bg-slate-700 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span>{country.flag}</span>
              {country.label}
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* 3. Advanced Filters Toggle */}
      <div>
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
        >
          <Filter className="w-3 h-3" />
          ADVANCED FILTERS
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showAdvanced && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 grid gap-4 animate-in fade-in slide-in-from-top-2">
            
            {/* Turnover Input */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Min. Daily Turnover (SEK)</label>
              <input 
                type="number"
                value={minTurnover}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinTurnover(val);
                  handleUpdate(undefined, undefined, val);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                placeholder="e.g. 1000000"
              />
            </div>

            {/* Market Cap Range */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Market Cap Range (MSEK)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={mcMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMcMin(val);
                    handleUpdate(undefined, undefined, undefined, val, mcMax);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  placeholder="Min"
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="number"
                  value={mcMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMcMax(val);
                    handleUpdate(undefined, undefined, undefined, mcMin, val);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  placeholder="Max"
                />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
