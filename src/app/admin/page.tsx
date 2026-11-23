'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  FolderGit2,
  Award,
  Sparkles,
  Briefcase,
  Mail,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Metrics {
  totalProjects: number;
  totalCertificates: number;
  totalSkills: number;
  totalExperience: number;
  unreadMessages: number;
  totalMessages: number;
}

interface DashboardData {
  metrics: Metrics;
  recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    published: boolean;
    updatedAt: string;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    isRead: boolean;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <AdminHeader
        title="Administrative Overview"
        subtitle="Real-time persistent database statistics & quick operations"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs font-mono text-secondary">
              Synchronizing database telemetry...
            </p>
          </div>
        ) : (
          <>
            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Projects Stat */}
              <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Projects in Database
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono text-primary mb-2">
                  {data?.metrics.totalProjects || 0}
                </div>
                <div className="flex items-center justify-between text-xs text-secondary pt-3 border-t border-surface-border">
                  <span className="text-emerald-400 font-medium">Published & Active</span>
                  <Link
                    href="/admin/projects"
                    className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Certificates Stat */}
              <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Verified Certificates
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono text-primary mb-2">
                  {data?.metrics.totalCertificates || 0}
                </div>
                <div className="flex items-center justify-between text-xs text-secondary pt-3 border-t border-surface-border">
                  <span>Across 5 categories</span>
                  <Link
                    href="/admin/certificates"
                    className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Skills Stat */}
              <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Cataloged Skills
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono text-primary mb-2">
                  {data?.metrics.totalSkills || 0}
                </div>
                <div className="flex items-center justify-between text-xs text-secondary pt-3 border-t border-surface-border">
                  <span>Frontend, AI & Tools</span>
                  <Link
                    href="/admin/skills"
                    className="text-pink-400 hover:text-pink-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Messages Stat */}
              <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-secondary uppercase">
                    Inbox Inquiries
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-3xl font-bold font-mono text-primary">
                    {data?.metrics.unreadMessages || 0}
                  </div>
                  <span className="text-xs text-secondary font-mono">
                    unread / {data?.metrics.totalMessages || 0} total
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-secondary pt-3 border-t border-surface-border">
                  <span className={data?.metrics.unreadMessages ? 'text-amber-400 font-bold' : ''}>
                    {data?.metrics.unreadMessages ? 'Requires attention' : 'All caught up'}
                  </span>
                  <Link
                    href="/admin/messages"
                    className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>View Inbox</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm">
              <h3 className="text-sm font-bold text-primary mb-4 font-mono uppercase tracking-wider">
                Quick Editorial Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/projects"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </Link>

                <Link
                  href="/admin/certificates"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border bg-surface-elevated hover:bg-surface text-primary text-xs font-semibold hover:border-cyan-500/40 transition-colors"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Upload Certificate</span>
                </Link>

                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border bg-surface-elevated hover:bg-surface text-primary text-xs font-semibold hover:border-pink-500/40 transition-colors"
                >
                  <span>Update Profile & Resume</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border bg-surface-elevated hover:bg-surface text-primary text-xs font-semibold hover:border-purple-500/40 transition-colors"
                >
                  <span>Global SEO & Theme</span>
                </Link>
              </div>
            </div>

            {/* Two Column Layout: Recent Projects & Recent Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Projects */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      Recent Projects
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">
                      Latest managed portfolio case studies
                    </p>
                  </div>
                  <Link
                    href="/admin/projects"
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {data?.recentProjects && data.recentProjects.length > 0 ? (
                    data.recentProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-primary">
                            {p.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400">
                              {p.status}
                            </span>
                            <span className={`text-[10px] font-mono ${p.published ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {p.published ? '● Published' : '○ Draft'}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/admin/projects"
                          className="p-2 rounded-lg hover:bg-surface text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-secondary">
                      No projects currently found.
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Contact Messages */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      Recent Inquiries
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">
                      Messages received via contact portal
                    </p>
                  </div>
                  <Link
                    href="/admin/messages"
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    View Inbox →
                  </Link>
                </div>

                <div className="space-y-3">
                  {data?.recentMessages && data.recentMessages.length > 0 ? (
                    data.recentMessages.map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-primary">
                              {m.name}
                            </span>
                            {!m.isRead && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-secondary truncate max-w-xs mt-0.5">
                            {m.subject || m.email}
                          </div>
                        </div>

                        <Link
                          href="/admin/messages"
                          className="p-2 rounded-lg hover:bg-surface text-secondary hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-secondary">
                      No contact messages received yet. Test by submitting through the public contact form!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
