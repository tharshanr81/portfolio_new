'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Settings,
  Globe,
  Sliders,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Key,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update settings');

      setFeedback({ type: 'success', message: 'Global settings saved to database!' });
      fetchSettings();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Global Portfolio Settings"
        subtitle="Manage SEO meta tags, site availability, and global appearance defaults"
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs font-mono text-secondary">Loading system settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
            {/* SEO & Metadata Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm space-y-4">
              <h3 className="font-bold text-base text-primary pb-3 border-b border-surface-border">
                SEO & Open Graph Meta Tags
              </h3>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Public SEO Page Title
                </label>
                <input
                  type="text"
                  value={settings.siteTitle || ''}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                  placeholder="Tharshan R | Full-Stack Developer & Software Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.metaDescription || ''}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="B.Tech Honours AI & Data Science developer building scalable applications..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Appearance & Visibility Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm space-y-4">
              <h3 className="font-bold text-base text-primary pb-3 border-b border-surface-border">
                System Preferences & Availability
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Default Theme Preference
                  </label>
                  <select
                    value={settings.defaultTheme || 'dark'}
                    onChange={(e) => handleChange('defaultTheme', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  >
                    <option value="dark">Dark Theme (Default Obsidian & Charcoal)</option>
                    <option value="light">Light Theme (Warm Alabaster & Editorial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Portfolio Visibility
                  </label>
                  <select
                    value={settings.portfolioVisibility || 'public'}
                    onChange={(e) => handleChange('portfolioVisibility', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  >
                    <option value="public">Publicly Accessible (Recommended)</option>
                    <option value="private">Private / Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Availability Pill Text (Navbar & Hero)
                </label>
                <input
                  type="text"
                  value={settings.availabilityStatus || ''}
                  onChange={(e) => handleChange('availabilityStatus', e.target.value)}
                  placeholder="Available for Opportunities"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-glow-sm disabled:opacity-50"
              >
                {submitting ? 'Applying Changes...' : 'Save Global Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
