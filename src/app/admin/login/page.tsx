'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-surface-border shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-glow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Admin CMS Console
          </h1>
          <p className="text-xs text-secondary mt-1">
            Enter your authorized administrative credentials to manage portfolio state.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-secondary mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted"
              />
              <Mail className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-secondary mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted"
              />
              <Lock className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-glow-sm hover:shadow-glow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Environment helper note */}
        <div className="mt-8 pt-6 border-t border-surface-border/60 text-center">
          <p className="text-[11px] text-muted font-mono leading-relaxed">
            Configured via environment variables <br />
            
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-canvas">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/"
          className="text-xs font-medium text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-surface-border bg-surface"
        >
          Back to Public Site
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="p-8 rounded-3xl bg-surface border border-surface-border flex items-center gap-2 text-xs font-mono text-secondary">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span>Loading authentication console...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
