'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const menuItems = [
    { href: '/', label: 'Hem' },
    { href: '/mean-reversion', label: 'Mean Reversion' },
    { href: '/strategy', label: 'Strategi' },
    { href: '/volume', label: 'Volym' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#1e293b] border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
        aria-label="Öppna meny"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
          <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e293b] border-r border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="text-red-500 text-xl font-bold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-white font-bold">DownStreak</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Stäng meny"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
