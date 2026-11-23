'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Github,
  ExternalLink,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problemSolved?: string | null;
  architecture?: string | null;
  keyFeatures: string;
  technologies: string;
  thumbnail?: string | null;
  images?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    problemSolved: '',
    architecture: '',
    keyFeaturesText: '',
    technologiesText: '',
    thumbnail: '',
    githubUrl: '',
    liveUrl: '',
    status: 'Completed',
    featured: false,
    published: true,
    displayOrder: 0,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const json = await res.json();
        setProjects(json.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      slug: '',
      summary: '',
      description: '',
      problemSolved: '',
      architecture: '',
      keyFeaturesText: '',
      technologiesText: '',
      thumbnail: '',
      githubUrl: '',
      liveUrl: '',
      status: 'Completed',
      featured: false,
      published: true,
      displayOrder: projects.length + 1,
    });
    setEditingProject(null);
    setIsCreating(true);
  };

  const openEditModal = (p: Project) => {
    let feats: string[] = [];
    try {
      feats = JSON.parse(p.keyFeatures);
    } catch {
      feats = p.keyFeatures ? [p.keyFeatures] : [];
    }

    let techs: string[] = [];
    try {
      techs = JSON.parse(p.technologies);
    } catch {
      techs = p.technologies ? [p.technologies] : [];
    }

    setFormData({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      problemSolved: p.problemSolved || '',
      architecture: p.architecture || '',
      keyFeaturesText: feats.join('\n'),
      technologiesText: techs.join(', '),
      thumbnail: p.thumbnail || '',
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      status: p.status,
      featured: p.featured,
      published: p.published,
      displayOrder: p.displayOrder,
    });
    setEditingProject(p);
    setIsCreating(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'projects');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, thumbnail: json.url }));
      } else {
        alert(json.error || 'Failed to upload image');
      }
    } catch {
      alert('Upload error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFeedback(null);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      description: formData.description,
      problemSolved: formData.problemSolved,
      architecture: formData.architecture,
      keyFeatures: formData.keyFeaturesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: formData.technologiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      thumbnail: formData.thumbnail,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      status: formData.status,
      featured: formData.featured,
      published: formData.published,
      displayOrder: Number(formData.displayOrder),
    };

    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save project');
      }

      setIsCreating(false);
      setEditingProject(null);
      setFeedback({ type: 'success', message: 'Project saved successfully!' });
      fetchProjects();

      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const togglePublished = async (p: Project) => {
    try {
      await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !p.published }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (p: Project) => {
    try {
      await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminHeader
        title="Project Management"
        subtitle="Create, update, reorder and publish portfolio case studies"
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by title or summary..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-surface-border text-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <div className="text-xs font-mono text-secondary">
            {filteredProjects.length} projects recorded
          </div>
        </div>

        {/* Projects Data Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs font-mono text-secondary">Loading projects...</p>
          </div>
        ) : (
          <div className="bg-surface border border-surface-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-elevated/70 border-b border-surface-border text-secondary font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Title & Tech</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Visibility</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {filteredProjects.map((p) => {
                    let techs: string[] = [];
                    try {
                      techs = JSON.parse(p.technologies);
                    } catch {
                      techs = [];
                    }

                    return (
                      <tr key={p.id} className="hover:bg-surface-elevated/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-secondary font-medium">
                          #{p.displayOrder}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-primary">{p.title}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {techs.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-elevated border border-surface-border text-secondary"
                              >
                                {t}
                              </span>
                            ))}
                            {techs.length > 3 && (
                              <span className="text-[10px] text-secondary self-center">
                                +{techs.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleFeatured(p)}
                            title="Toggle featured status"
                            className={`p-1.5 rounded-lg border transition-colors ${
                              p.featured
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-surface border-surface-border text-secondary hover:text-primary'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePublished(p)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                              p.published
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-surface-elevated text-secondary border border-surface-border'
                            }`}
                          >
                            {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{p.published ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg border border-surface-border bg-surface hover:bg-red-500/10 text-secondary hover:text-red-400 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
              <div>
                <h3 className="text-xl font-bold text-primary">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Update project metadata, technologies, and architecture breakdown
                </p>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full border border-surface-border bg-surface-elevated text-secondary hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Summary / Elevator Pitch *
                </label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Full Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    The Problem Solved
                  </label>
                  <textarea
                    rows={3}
                    value={formData.problemSolved}
                    onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    System Architecture
                  </label>
                  <textarea
                    rows={3}
                    value={formData.architecture}
                    onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Key Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.keyFeaturesText}
                  onChange={(e) => setFormData({ ...formData, keyFeaturesText: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Technologies (Comma separated, e.g. React, Next.js, Prisma)
                </label>
                <input
                  type="text"
                  value={formData.technologiesText}
                  onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              {/* Upload image / Thumbnail */}
              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Thumbnail Image or Video Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="/uploads/projects/thumbnail.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-xs font-medium text-secondary hover:text-primary transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Production">Production</option>
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
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-4 pt-5">
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-secondary hover:text-primary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : 'Save Project to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
