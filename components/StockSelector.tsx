'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface StockSelectorProps {
  onSelect: (country: 'sweden' | 'canada' | 'usa', capSize: 'large' | 'mid' | 'small') => void;
  isLoading?: boolean;
}

export function StockSelector({ onSelect, isLoading = false }: StockSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<'sweden' | 'canada' | 'usa'>('sweden');
  const [selectedCapSize, setSelectedCapSize] = useState<'large' | 'mid' | 'small'>('large');

  const handleCountryChange = (country: 'sweden' | 'canada' | 'usa') => {
    setSelectedCountry(country);
    onSelect(country, selectedCapSize);
  };

  const handleCapSizeChange = (capSize: 'large' | 'mid' | 'small') => {
    setSelectedCapSize(capSize);
    onSelect(selectedCountry, capSize);
  };

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Land/Börs Dropdown */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
            Land / Börs
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value as 'sweden' | 'canada' | 'usa')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="sweden">🇸🇪 Sverige (Nasdaq Stockholm)</option>
            <option value="canada">🇨🇦 Kanada (TSX)</option>
            <option value="usa">🇺🇸 USA (NYSE & NASDAQ)</option>
          </select>
        </div>

        {/* Kapitalstorlek Dropdown */}
        <div>
          <label htmlFor="capSize" className="block text-sm font-medium text-slate-300 mb-2">
            Kapitalstorlek
          </label>
          <select
            id="capSize"
            value={selectedCapSize}
            onChange={(e) => handleCapSizeChange(e.target.value as 'large' | 'mid' | 'small')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="large">Large Cap</option>
            <option value="mid">Mid Cap</option>
            <option value="small">Small Cap</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Hämtar data...</span>
        </div>
      )}
    </div>
  );
}
