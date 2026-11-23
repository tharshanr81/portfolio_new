'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/admin/dashboard')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.metrics?.unreadMessages !== undefined) {
            setUnreadCount(data.metrics.unreadMessages);
          }
        })
        .catch(() => {});
    }
  }, [pathname, isLoginPage]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-canvas text-primary">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-canvas text-primary flex">
      {/* CMS Sidebar */}
      <AdminSidebar unreadMessagesCount={unreadCount} />

      {/* Main Administrative Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
