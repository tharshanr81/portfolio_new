'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  responsibilities?: string | null;
  displayOrder: number;
  published: boolean;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    responsibilitiesText: '',
    displayOrder: 0,
    published: true,
  });

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/experience');
      if (res.ok) {
        const json = await res.json();
        setExperiences(json.experiences || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setFormData({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      responsibilitiesText: '',
      displayOrder: experiences.length + 1,
      published: true,
    });
    setEditingExp(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    let resp: string[] = [];
    try {
      resp = JSON.parse(exp.responsibilities || '[]');
    } catch {
      resp = exp.responsibilities ? [exp.responsibilities] : [];
    }

    setFormData({
      role: exp.role,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      description: exp.description,
      responsibilitiesText: resp.join('\n'),
      displayOrder: exp.displayOrder,
      published: exp.published,
    });
    setEditingExp(exp);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      role: formData.role,
      company: formData.company,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? 'Present' : formData.endDate,
      isCurrent: formData.isCurrent,
      description: formData.description,
      responsibilities: formData.responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      displayOrder: Number(formData.displayOrder),
      published: formData.published,
    };

    try {
      const url = editingExp
        ? `/api/admin/experience/${editingExp.id}`
        : '/api/admin/experience';
      const method = editingExp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save experience');

      setIsModalOpen(false);
      setEditingExp(null);
      setFeedback({ type: 'success', message: 'Experience successfully saved!' });
      fetchExperiences();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (exp: Experience) => {
    try {
      await fetch(`/api/admin/experience/${exp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !exp.published }),
      });
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (res.ok) fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Experience Management"
        subtitle="Manage professional internships, responsibilities, and timeline entries"
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
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
            <p className="text-xs font-mono text-secondary">Loading experiences...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-primary">{exp.role}</h3>
                    <span className="text-sm font-semibold text-purple-400">@ {exp.company}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-secondary line-clamp-2 max-w-2xl">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(exp)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                      exp.published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-surface-elevated text-secondary border border-surface-border'
                    }`}
                  >
                    {exp.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{exp.published ? 'Published' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-xl border border-surface-border bg-surface hover:bg-red-500/10 text-secondary hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
              <h3 className="text-xl font-bold text-primary">
                {editingExp ? 'Edit Experience' : 'Add Experience Entry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full border border-surface-border bg-surface-elevated text-secondary hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Frontend Developer Intern"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Zetheta Algorithms Pvt. Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="Jan 2026"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={formData.isCurrent}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="Present"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Chennai / Remote"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                    className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
                  />
                  <span>Currently active in this position</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  General Overview Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Engineered high-performance real-time data visualizer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Responsibilities & Impact (One bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.responsibilitiesText}
                  onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                  placeholder="Responsibility 1&#10;Responsibility 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div className="pt-6">
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
                    />
                    <span>Visible on portfolio</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-secondary hover:text-primary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
