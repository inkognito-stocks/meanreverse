'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

const CORRECT_PASSWORD = 'mogoteshittarguld';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Kontrollera om användaren redan är inloggad
    const isAuthenticated = document.cookie
      .split('; ')
      .find(row => row.startsWith('authenticated='))
      ?.split('=')[1] === 'true';

    if (isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password === CORRECT_PASSWORD) {
      // Sätt cookie som varar i 30 dagar
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie = `authenticated=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

      // Omdirigera till huvudsidan
      router.push('/');
      router.refresh();
    } else {
      setError('Fel lösenord. Försök igen.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#334155] p-4 rounded-full mb-4">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mean Reverse Dashboard</h1>
          <p className="text-slate-400 text-sm">Ange lösenord för att fortsätta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ange lösenord"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
}
