'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon?: string | null;
  categoryId: string;
  displayOrder: number;
  published: boolean;
}

interface SkillCategory {
  id: string;
  name: string;
  displayOrder: number;
  skills: Skill[];
}

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    categoryId: '',
    newCategoryName: '',
    displayOrder: 0,
    published: true,
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const json = await res.json();
        setCategories(json.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setFormData({
      name: '',
      icon: '',
      categoryId: categories[0]?.id || '',
      newCategoryName: '',
      displayOrder: 0,
      published: true,
    });
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Skill) => {
    setFormData({
      name: s.name,
      icon: s.icon || '',
      categoryId: s.categoryId,
      newCategoryName: '',
      displayOrder: s.displayOrder,
      published: s.published,
    });
    setEditingSkill(s);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formData.name,
      icon: formData.icon,
      categoryId: formData.categoryId,
      newCategoryName: formData.newCategoryName,
      displayOrder: Number(formData.displayOrder),
      published: formData.published,
    };

    try {
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : '/api/admin/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save skill');

      setIsModalOpen(false);
      setEditingSkill(null);
      setFeedback({ type: 'success', message: 'Skill successfully synchronized!' });
      fetchSkills();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (s: Skill) => {
    try {
      await fetch(`/api/admin/skills/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !s.published }),
      });
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Skills & Technologies"
        subtitle="Organize technical proficiencies by domain with persistent publishing control"
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
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
            <p className="text-xs font-mono text-secondary">Loading skills matrix...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm"
              >
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-primary">{cat.name}</h3>
                      <p className="text-xs text-secondary font-mono">{cat.skills.length} skills cataloged</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cat.skills.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">{s.name}</span>
                        {!s.published && (
                          <span className="text-[10px] font-mono text-amber-400">(Draft)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => togglePublished(s)}
                          className={`p-1 rounded ${s.published ? 'text-emerald-400' : 'text-secondary'}`}
                          title={s.published ? 'Published' : 'Hidden'}
                        >
                          {s.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1 rounded text-secondary hover:text-primary"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1 rounded text-secondary hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
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
          <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
              <h3 className="text-xl font-bold text-primary">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Next.js (App Router)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
                  />
                  <span>Show publicly on portfolio</span>
                </label>
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
                  {submitting ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
