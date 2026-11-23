'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  Reply,
  Calendar,
  AlertCircle,
  Loader2,
  X,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (m: Message, targetState?: boolean) => {
    const newState = targetState !== undefined ? targetState : !m.isRead;
    try {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: newState }),
      });
      fetchMessages();
      if (activeMessage && activeMessage.id === m.id) {
        setActiveMessage({ ...activeMessage, isRead: newState });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (activeMessage?.id === id) setActiveMessage(null);
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (m: Message) => {
    setActiveMessage(m);
    if (!m.isRead) {
      toggleRead(m, true);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Contact Messages Inbox"
        subtitle="Inquiries submitted securely through the public portfolio contact form"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs font-mono text-secondary">Checking inbox...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-16 rounded-3xl bg-surface border border-surface-border text-center">
            <Mail className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="font-bold text-base text-primary mb-1">
              Your inbox is clean
            </h3>
            <p className="text-xs text-secondary max-w-md mx-auto">
              No inquiries received yet. Visitors can send you messages via the public portfolio contact form.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Messages List Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono text-secondary px-2 flex justify-between">
                <span>{messages.length} messages</span>
                <span>{messages.filter((m) => !m.isRead).length} unread</span>
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleOpen(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeMessage?.id === m.id
                      ? 'bg-purple-500/10 border-purple-500/50 shadow-sm'
                      : !m.isRead
                      ? 'bg-surface border-purple-500/30 hover:border-purple-500/40'
                      : 'bg-surface border-surface-border hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-primary">
                        {m.name}
                      </span>
                      {!m.isRead && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-secondary">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-purple-400 truncate mb-1">
                    {m.subject || 'No Subject'}
                  </div>

                  <p className="text-xs text-secondary line-clamp-2">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Detail View */}
            <div className="lg:col-span-7">
              {activeMessage ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm space-y-6">
                  <div className="flex items-start justify-between pb-6 border-b border-surface-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-xl text-primary">
                          {activeMessage.subject || 'No Subject'}
                        </h3>
                      </div>
                      <div className="text-xs text-secondary flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-primary">{activeMessage.name}</span>
                        <span>•</span>
                        <a
                          href={`mailto:${activeMessage.email}`}
                          className="text-purple-400 hover:underline"
                        >
                          {activeMessage.email}
                        </a>
                        <span>•</span>
                        <span className="font-mono">{formatDate(activeMessage.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRead(activeMessage)}
                        className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface text-xs font-mono text-secondary hover:text-primary transition-colors"
                      >
                        {activeMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDelete(activeMessage.id)}
                        className="p-2 rounded-lg border border-surface-border text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 rounded-2xl bg-surface-elevated border border-surface-border text-sm text-primary leading-relaxed whitespace-pre-wrap">
                    {activeMessage.message}
                  </div>

                  {/* Reply Button */}
                  <div className="pt-4 flex justify-end">
                    <a
                      href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                        activeMessage.subject || 'Portfolio Inquiry'
                      )}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-glow-sm transition-all"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-16 rounded-3xl bg-surface border border-surface-border text-center text-secondary text-xs font-mono">
                  Select a message from the list to inspect details and respond.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
