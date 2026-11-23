'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  Sparkles,
  Briefcase,
  GraduationCap,
  UserCheck,
  Mail,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  unreadMessagesCount?: number;
}

export function AdminSidebar({ unreadMessagesCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Skills & Tech', href: '/admin/skills', icon: Sparkles },
    { name: 'Experience', href: '/admin/experience', icon: Briefcase },
    { name: 'Education', href: '/admin/education', icon: GraduationCap },
    { name: 'Profile Details', href: '/admin/profile', icon: UserCheck },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <aside className="w-64 bg-surface border-r border-surface-border flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
              T
            </div>
            <div>
              <div className="font-bold text-sm text-primary tracking-tight">
                Portfolio CMS
              </div>
              <div className="text-[11px] text-purple-400 font-mono">
                Admin Console
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-glow-sm'
                    : 'text-secondary hover:text-primary hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-secondary group-hover:text-purple-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-elevated transition-colors border border-surface-border/60"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Public Site</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-secondary" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
