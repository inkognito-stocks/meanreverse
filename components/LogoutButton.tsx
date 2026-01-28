'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Ta bort autentiserings-cookie
    document.cookie = 'authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Omdirigera till login-sidan
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm"
      title="Logga ut"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logga ut</span>
    </button>
  );
}
