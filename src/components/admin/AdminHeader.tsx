'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="border-b border-surface-border bg-surface/50 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}

        {/* Public view shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface text-xs font-medium text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          <span>Live Site</span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Admin Identity */}
        <div className="flex items-center gap-2 pl-3 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 text-xs font-bold">
            TR
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-primary">Tharshan R</div>
            <div className="text-[10px] text-purple-400 font-mono">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
