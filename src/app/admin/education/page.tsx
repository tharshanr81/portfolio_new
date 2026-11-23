'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Check,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  score?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  displayOrder: number;
  published: boolean;
}

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    score: '',
    startDate: '',
    endDate: '',
    description: '',
    displayOrder: 0,
    published: true,
  });

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/education');
      if (res.ok) {
        const json = await res.json();
        setEducations(json.educations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      score: '',
      startDate: '',
      endDate: '',
      description: '',
      displayOrder: educations.length + 1,
      published: true,
    });
    setEditingEdu(null);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      score: edu.score || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      description: edu.description || '',
      displayOrder: edu.displayOrder,
      published: edu.published,
    });
    setEditingEdu(edu);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      score: formData.score,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      displayOrder: Number(formData.displayOrder),
      published: formData.published,
    };

    try {
      const url = editingEdu
        ? `/api/admin/education/${editingEdu.id}`
        : '/api/admin/education';
      const method = editingEdu ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save education');

      setIsModalOpen(false);
      setEditingEdu(null);
      setFeedback({ type: 'success', message: 'Academic record successfully saved!' });
      fetchEducation();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (edu: Education) => {
    try {
      await fetch(`/api/admin/education/${edu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !edu.published }),
      });
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Education Management"
        subtitle="Manage academic institutions, degree credentials, and honours research"
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
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
            <p className="text-xs font-mono text-secondary">Loading education records...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded-3xl bg-surface border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-primary">{edu.degree}</h3>
                    {edu.score && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {edu.score}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-purple-400 mb-1">
                    {edu.fieldOfStudy}
                  </div>
                  <div className="text-xs text-secondary mb-2">
                    {edu.institution} ({edu.startDate} – {edu.endDate || 'Present'})
                  </div>
                  {edu.description && (
                    <p className="text-xs text-secondary max-w-2xl line-clamp-2">
                      {edu.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(edu)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                      edu.published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-surface-elevated text-secondary border border-surface-border'
                    }`}
                  >
                    {edu.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{edu.published ? 'Published' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-2 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(edu.id)}
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
          <div className="relative w-full max-w-lg bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
              <h3 className="text-xl font-bold text-primary">
                {editingEdu ? 'Edit Academic Qualification' : 'Add Academic Qualification'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full border border-surface-border bg-surface-elevated text-secondary hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Degree Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Technology (B.Tech Honours)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Field of Study / Branch
                  </label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder="Artificial Intelligence & Data Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Score / CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="CGPA: 7.80 / 10"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    End Year
                  </label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="2027"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Academic Focus / Thesis
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specialization in full-stack engineering, decision intelligence, machine learning..."
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
                  {submitting ? 'Saving...' : 'Save Qualification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
