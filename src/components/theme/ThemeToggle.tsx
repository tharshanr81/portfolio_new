'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full border border-surface-border bg-surface ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-surface-border bg-surface hover:bg-surface-elevated transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-500 transform ${
            isDark ? 'translate-y-6 opacity-0 rotate-90 scale-50' : 'translate-y-0 opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`absolute w-4 h-4 text-purple-400 transition-all duration-500 transform ${
            isDark ? 'translate-y-0 opacity-100 rotate-0 scale-100' : '-translate-y-6 opacity-0 -rotate-90 scale-50'
          }`}
        />
      </div>
    </button>
  );
}
