'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface StockSelectorProps {
  onSelect: (countries: ('sweden' | 'canada' | 'usa')[], capSizes: ('large' | 'mid' | 'small')[]) => void;
  isLoading?: boolean;
}

export function StockSelector({ onSelect, isLoading = false }: StockSelectorProps) {
  const [selectedCountries, setSelectedCountries] = useState<('sweden' | 'canada' | 'usa')[]>(['sweden']);
  const [selectedCapSizes, setSelectedCapSizes] = useState<('large' | 'mid' | 'small')[]>(['large']);

  // Uppdatera när val ändras
  // OBS: onSelect är INTE i dependency-arrayen för att undvika oändlig loop
  // onSelect skapas på nytt varje render i parent-komponenten
  useEffect(() => {
    if (selectedCountries.length > 0 && selectedCapSizes.length > 0) {
      onSelect(selectedCountries, selectedCapSizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountries, selectedCapSizes]);

  const handleCountryToggle = (country: 'sweden' | 'canada' | 'usa') => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        // Ta bort om redan vald, men se till att minst ett land är valt
        const newSelection = prev.filter(c => c !== country);
        return newSelection.length > 0 ? newSelection : prev;
      } else {
        // Lägg till om inte vald
        return [...prev, country];
      }
    });
  };

  const handleCapSizeToggle = (capSize: 'large' | 'mid' | 'small') => {
    setSelectedCapSizes(prev => {
      if (prev.includes(capSize)) {
        // Ta bort om redan vald, men se till att minst en kapitalstorlek är vald
        const newSelection = prev.filter(c => c !== capSize);
        return newSelection.length > 0 ? newSelection : prev;
      } else {
        // Lägg till om inte vald
        return [...prev, capSize];
      }
    });
  };

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Land/Börs Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Land / Börs
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCountries.includes('sweden')}
                onChange={() => handleCountryToggle('sweden')}
                disabled={isLoading || (selectedCountries.length === 1 && selectedCountries.includes('sweden'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                🇸🇪 Sverige (Nasdaq Stockholm)
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCountries.includes('canada')}
                onChange={() => handleCountryToggle('canada')}
                disabled={isLoading || (selectedCountries.length === 1 && selectedCountries.includes('canada'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                🇨🇦 Kanada (TSX)
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCountries.includes('usa')}
                onChange={() => handleCountryToggle('usa')}
                disabled={isLoading || (selectedCountries.length === 1 && selectedCountries.includes('usa'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                🇺🇸 USA (NYSE & NASDAQ)
              </span>
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {selectedCountries.length} {selectedCountries.length === 1 ? 'land valt' : 'länder valda'}
          </p>
        </div>

        {/* Lista Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Lista
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCapSizes.includes('large')}
                onChange={() => handleCapSizeToggle('large')}
                disabled={isLoading || (selectedCapSizes.length === 1 && selectedCapSizes.includes('large'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                Large Cap
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCapSizes.includes('mid')}
                onChange={() => handleCapSizeToggle('mid')}
                disabled={isLoading || (selectedCapSizes.length === 1 && selectedCapSizes.includes('mid'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                Mid Cap
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCapSizes.includes('small')}
                onChange={() => handleCapSizeToggle('small')}
                disabled={isLoading || (selectedCapSizes.length === 1 && selectedCapSizes.includes('small'))}
                className="w-4 h-4 rounded border-slate-600 bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-white group-hover:text-green-400 transition-colors">
                Small Cap
              </span>
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {selectedCapSizes.length} {selectedCapSizes.length === 1 ? 'lista vald' : 'listor valda'}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Hämtar data för {selectedCountries.length} {selectedCountries.length === 1 ? 'land' : 'länder'}...</span>
        </div>
      )}
    </div>
  );
}
