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
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  Award,
} from 'lucide-react';
import Image from 'next/image';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  fileUrl?: string | null;
  category: string;
  published: boolean;
  displayOrder: number;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '2025',
    credentialUrl: '',
    fileUrl: '',
    category: 'General',
    published: true,
    displayOrder: 0,
  });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/certificates');
      if (res.ok) {
        const json = await res.json();
        setCertificates(json.certificates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '2025',
      credentialUrl: '',
      fileUrl: '',
      category: 'General',
      published: true,
      displayOrder: certificates.length + 1,
    });
    setEditingCert(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Certificate) => {
    setFormData({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl || '',
      fileUrl: c.fileUrl || '',
      category: c.category,
      published: c.published,
      displayOrder: c.displayOrder,
    });
    setEditingCert(c);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'certificates');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, fileUrl: json.url }));
      } else {
        alert(json.error || 'Failed to upload certificate');
      }
    } catch {
      alert('Upload error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      credentialUrl: formData.credentialUrl,
      fileUrl: formData.fileUrl,
      category: formData.category,
      published: formData.published,
      displayOrder: Number(formData.displayOrder),
    };

    try {
      const url = editingCert
        ? `/api/admin/certificates/${editingCert.id}`
        : '/api/admin/certificates';
      const method = editingCert ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save certificate');
      }

      setIsModalOpen(false);
      setEditingCert(null);
      setFeedback({ type: 'success', message: 'Certificate saved successfully!' });
      fetchCertificates();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (c: Certificate) => {
    try {
      await fetch(`/api/admin/certificates/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !c.published }),
      });
      fetchCertificates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCertificates();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminHeader
        title="Certificate Management"
        subtitle="Manage verified diplomas, internship certificates, and competition awards"
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Certificate</span>
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

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, issuer, or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-surface-border text-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <div className="text-xs font-mono text-secondary">
            {filtered.length} certificates
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs font-mono text-secondary">Loading credentials...</p>
          </div>
        ) : (
          <div className="bg-surface border border-surface-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-elevated/70 border-b border-surface-border text-secondary font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title & Issuer</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Visibility</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-6 py-4">
                        {c.fileUrl ? (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-black/20 border border-surface-border">
                            <Image src={c.fileUrl} alt={c.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center text-secondary">
                            <Award className="w-4 h-4 text-purple-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">{c.title}</div>
                        <div className="text-xs text-secondary mt-0.5">{c.issuer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-secondary">
                        {c.issueDate}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublished(c)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                            c.published
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-surface-elevated text-secondary border border-surface-border'
                          }`}
                        >
                          {c.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{c.published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg border border-surface-border bg-surface hover:bg-red-500/10 text-secondary hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                {editingCert ? 'Edit Certificate' : 'Upload New Certificate'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Python Development Certification"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Issuer Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. NPTEL / Infosys"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  >
                    <option value="Experience">Experience</option>
                    <option value="Web">Web</option>
                    <option value="Python">Python</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Achievements">Achievements</option>
                    <option value="General">General</option>
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
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Credential URL
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">
                  Certificate Image / PDF File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="/uploads/certificates/cert.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-xs font-medium text-secondary hover:text-primary">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
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
                  {submitting ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
