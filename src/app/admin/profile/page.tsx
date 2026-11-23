"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Github,
	Linkedin,
	FileDown,
	Upload,
	Check,
	AlertCircle,
	Loader2,
	Sparkles,
} from "lucide-react";
import Image from "next/image";

interface ProfileData {
	id: string;
	name: string;
	headline: string;
	role: string;
	bio: string;
	aboutDetails?: string | null;
	email: string;
	phone?: string | null;
	location: string;
	avatarUrl?: string | null;
	resumeUrl?: string | null;
	githubUrl?: string | null;
	linkedinUrl?: string | null;
	isAvailable: boolean;
}

export default function AdminProfilePage() {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		headline: "",
		role: "",
		bio: "",
		aboutDetails: "",
		email: "",
		phone: "",
		location: "",
		avatarUrl: "",
		resumeUrl: "",
		githubUrl: "",
		linkedinUrl: "",
		isAvailable: true,
	});

	const fetchProfile = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/admin/profile");
			if (res.ok) {
				const json = await res.json();
				if (json.profile) {
					setProfile(json.profile);
					setFormData({
						name: json.profile.name || "",
						headline: json.profile.headline || "",
						role: json.profile.role || "",
						bio: json.profile.bio || "",
						aboutDetails: json.profile.aboutDetails || "",
						email: json.profile.email || "",
						phone: json.profile.phone || "",
						location: json.profile.location || "",
						avatarUrl: json.profile.avatarUrl || "",
						resumeUrl: json.profile.resumeUrl || "",
						githubUrl: json.profile.githubUrl || "",
						linkedinUrl: json.profile.linkedinUrl || "",
						isAvailable: Boolean(json.profile.isAvailable),
					});
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		field: "avatarUrl" | "resumeUrl",
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const data = new FormData();
		data.append("file", file);
		data.append("folder", field === "avatarUrl" ? "avatars" : "resumes");

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: data,
			});
			const json = await res.json();
			if (res.ok && json.url) {
				setFormData((prev) => ({ ...prev, [field]: json.url }));
				setFeedback({
					type: "success",
					message: `${field === "avatarUrl" ? "Avatar" : "Resume"} uploaded successfully!`,
				});
				setTimeout(() => setFeedback(null), 3000);
			} else {
				alert(json.error || "Upload failed");
			}
		} catch {
			alert("Upload error");
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setFeedback(null);

		try {
			const res = await fetch("/api/admin/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update profile");

			setFeedback({
				type: "success",
				message: "Profile updated in persistent database!",
			});
			fetchProfile();
			setTimeout(() => setFeedback(null), 4000);
		} catch (err: any) {
			setFeedback({ type: "error", message: err.message || "Error occurred" });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<AdminHeader
				title="Profile & Bio Management"
				subtitle="Manage public identity, contact coordinates, avatar and resume download"
			/>

			<div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
				{feedback && (
					<div
						className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
							feedback.type === "success"
								? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
								: "bg-red-500/10 border border-red-500/20 text-red-400"
						}`}
					>
						{feedback.type === "success" ? (
							<Check className="w-4 h-4" />
						) : (
							<AlertCircle className="w-4 h-4" />
						)}
						<span>{feedback.message}</span>
					</div>
				)}

				{loading ? (
					<div className="py-20 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 animate-spin text-purple-500" />
						<p className="text-xs font-mono text-secondary">
							Loading profile...
						</p>
					</div>
				) : (
					<form onSubmit={handleSave} className="space-y-8 text-xs sm:text-sm">
						{/* Identity & Avatar Card */}
						<div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm space-y-6">
							<h3 className="font-bold text-base text-primary pb-3 border-b border-surface-border">
								Identity & Visual Asset
							</h3>

							<div className="flex flex-col sm:flex-row items-center gap-6">
								<div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-surface-elevated border-2 border-surface-border shrink-0 shadow-md">
									{formData.avatarUrl ? (
										<Image
											src={formData.avatarUrl}
											alt="Avatar"
											fill
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-secondary">
											<User className="w-10 h-10" />
										</div>
									)}
								</div>

								<div className="space-y-2 flex-1">
									<label className="block text-xs font-mono text-secondary">
										Profile Avatar Path or Upload
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											value={formData.avatarUrl}
											onChange={(e) =>
												setFormData({ ...formData, avatarUrl: e.target.value })
											}
											placeholder="/uploads/avatar.png"
											className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
										/>
										<label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-xs font-medium text-secondary hover:text-primary">
											<Upload className="w-4 h-4" />
											<span>Upload Avatar</span>
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleFileUpload(e, "avatarUrl")}
												className="hidden"
											/>
										</label>
									</div>
									<p className="text-[11px] text-muted">
										Persistent server storage. PNG, JPG or WebP recommended.
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										Full Name *
									</label>
									<input
										type="text"
										required
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
									/>
								</div>
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										Professional Role / Title *
									</label>
									<input
										type="text"
										required
										value={formData.role}
										onChange={(e) =>
											setFormData({ ...formData, role: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-mono text-secondary mb-1">
									Hero Editorial Headline
								</label>
								<input
									type="text"
									value={formData.headline}
									onChange={(e) =>
										setFormData({ ...formData, headline: e.target.value })
									}
									className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
								/>
							</div>

							<div>
								<label className="block text-xs font-mono text-secondary mb-1">
									Deep Narrative (About Section)
								</label>
								<textarea
									rows={4}
									value={formData.aboutDetails}
									onChange={(e) =>
										setFormData({ ...formData, aboutDetails: e.target.value })
									}
									className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none resize-none"
								/>
							</div>
						</div>

						{/* Contact Coordinates & Socials */}
						<div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-sm space-y-4">
							<h3 className="font-bold text-base text-primary pb-3 border-b border-surface-border">
								Contact Coordinates & Digital Footprint
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										Contact Email *
									</label>
									<input
										type="email"
										required
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
								</div>
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										Phone Number
									</label>
									<input
										type="text"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
								</div>
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										Base Location
									</label>
									<input
										type="text"
										value={formData.location}
										onChange={(e) =>
											setFormData({ ...formData, location: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										GitHub URL
									</label>
									<input
										type="url"
										value={formData.githubUrl}
										onChange={(e) =>
											setFormData({ ...formData, githubUrl: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
								</div>
								<div>
									<label className="block text-xs font-mono text-secondary mb-1">
										LinkedIn URL
									</label>
									<input
										type="url"
										value={formData.linkedinUrl}
										onChange={(e) =>
											setFormData({ ...formData, linkedinUrl: e.target.value })
										}
										className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
								</div>
							</div>

							{/* Resume File Upload */}
							<div>
								<label className="block text-xs font-mono text-secondary mb-1">
									Resume PDF File
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={formData.resumeUrl}
										onChange={(e) =>
											setFormData({ ...formData, resumeUrl: e.target.value })
										}
										placeholder="/uploads/resume.pdf"
										className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-primary focus:outline-none"
									/>
									<label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-elevated text-xs font-medium text-secondary hover:text-primary">
										<Upload className="w-4 h-4" />
										<span>Upload Resume PDF</span>
										<input
											type="file"
											accept=".pdf"
											onChange={(e) => handleFileUpload(e, "resumeUrl")}
											className="hidden"
										/>
									</label>
								</div>
							</div>

							<div className="pt-2">
								<label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
									<input
										type="checkbox"
										checked={formData.isAvailable}
										onChange={(e) =>
											setFormData({
												...formData,
												isAvailable: e.target.checked,
											})
										}
										className="rounded border-surface-border text-purple-600 focus:ring-purple-500"
									/>
									<span>
										Mark as &quot;Available for Opportunities&quot; (displays
										live badge in header)
									</span>
								</label>
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<button
								type="submit"
								disabled={submitting}
								className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-glow-sm disabled:opacity-50"
							>
								{submitting ? "Persisting Profile..." : "Save Profile Changes"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
