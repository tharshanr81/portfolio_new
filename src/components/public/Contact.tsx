"use client";

import React, { useState } from "react";
import {
	Mail,
	Phone,
	MapPin,
	Github,
	Linkedin,
	Send,
	CheckCircle2,
	AlertCircle,
	FileDown,
	Loader2,
} from "lucide-react";

interface ContactProps {
	email?: string;
	phone?: string | null;
	location?: string;
	githubUrl?: string | null;
	linkedinUrl?: string | null;
	resumeUrl?: string | null;
}

export function Contact({
	email = "tharshanr7878@gmail.com",
	phone = "+91 8122057204",
	location = "Chennai, India",
	githubUrl = "https://github.com/tharshanr81",
	linkedinUrl = "https://www.linkedin.com/in/tharshanr81/",
	resumeUrl = "/resume.pdf",
}: ContactProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [statusMessage, setStatusMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setStatusMessage("");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to submit contact message");
			}

			setStatus("success");
			setStatusMessage(
				data.message || "Message sent successfully! I will respond promptly.",
			);
			setFormData({ name: "", email: "", subject: "", message: "" });

			setTimeout(() => {
				setStatus("idle");
				setStatusMessage("");
			}, 7000);
		} catch (err: any) {
			setStatus("error");
			setStatusMessage(
				err.message || "Something went wrong. Please email directly.",
			);
		}
	};

	return (
		<section
			id="contact"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
					{/* Left Column: Contact Narrative & Channels */}
					<div className="lg:col-span-5 flex flex-col items-start">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
							<span>07 | DROP ME A LINE</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-4">
							Let&apos;s build something remarkable together.
						</h2>
						<p className="text-base text-secondary leading-relaxed mb-8">
							Whether you are hiring for full-stack engineering roles, exploring
							technical collaboration, or interested in my capstone research, I
							am always open to conversation.
						</p>

						{/* Direct Contact Channels */}
						<div className="space-y-4 w-full mb-8">
							<a
								href={`mailto:${email}`}
								className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-surface-border hover:border-purple-500/40 transition-colors group shadow-sm"
							>
								<div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
									<Mail className="w-5 h-5" />
								</div>
								<div>
									<div className="text-xs text-secondary font-mono">
										Email Address
									</div>
									<div className="text-sm font-semibold text-primary">
										{email}
									</div>
								</div>
							</a>

							{phone && (
								<div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-surface-border shadow-sm">
									<div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
										<Phone className="w-5 h-5" />
									</div>
									<div>
										<div className="text-xs text-secondary font-mono">
											Phone
										</div>
										<div className="text-sm font-semibold text-primary">
											{phone}
										</div>
									</div>
								</div>
							)}

							<div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-surface-border shadow-sm">
								<div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
									<MapPin className="w-5 h-5" />
								</div>
								<div>
									<div className="text-xs text-secondary font-mono">
										Current Location
									</div>
									<div className="text-sm font-semibold text-primary">
										{location}
									</div>
								</div>
							</div>
						</div>

						{/* Social & Resume Links */}
						<div className="flex items-center gap-3 w-full">
							{githubUrl && (
								<a
									href={githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-surface-border bg-surface hover:bg-surface-elevated text-primary text-xs font-semibold hover:border-purple-500/40 transition-colors"
								>
									<Github className="w-4 h-4 text-purple-500" />
									<span>GitHub</span>
								</a>
							)}

							{linkedinUrl && (
								<a
									href={linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-surface-border bg-surface hover:bg-surface-elevated text-primary text-xs font-semibold hover:border-purple-500/40 transition-colors"
								>
									<Linkedin className="w-4 h-4 text-cyan-400" />
									<span>LinkedIn</span>
								</a>
							)}

							<a
								href={resumeUrl || "/resume.pdf"}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-surface-border bg-surface hover:bg-surface-elevated text-primary text-xs font-semibold hover:border-purple-500/40 transition-colors"
							>
								<FileDown className="w-4 h-4 text-emerald-400" />
								<span>Resume</span>
							</a>
						</div>
					</div>

					{/* Right Column: Working Contact Form */}
					<div className="lg:col-span-7 bg-surface border border-surface-border rounded-3xl p-6 sm:p-10 shadow-sm">
						<h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
							Send a direct message
						</h3>
						<p className="text-xs sm:text-sm text-secondary mb-8">
							Submissions are stored securely in database persistent storage
							with real-time admin review.
						</p>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-mono text-secondary mb-1.5">
										Your Name *
									</label>
									<input
										type="text"
										required
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="e.g. John Doe"
										className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted"
									/>
								</div>

								<div>
									<label className="block text-xs font-mono text-secondary mb-1.5">
										Email Address *
									</label>
									<input
										type="email"
										required
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="john@company.com"
										className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-mono text-secondary mb-1.5">
									Subject
								</label>
								<input
									type="text"
									value={formData.subject}
									onChange={(e) =>
										setFormData({ ...formData, subject: e.target.value })
									}
									placeholder="Software Engineering Opportunity / Project Collaboration"
									className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted"
								/>
							</div>

							<div>
								<label className="block text-xs font-mono text-secondary mb-1.5">
									Message *
								</label>
								<textarea
									required
									rows={5}
									value={formData.message}
									onChange={(e) =>
										setFormData({ ...formData, message: e.target.value })
									}
									placeholder="Share details regarding your role, timeline, or project..."
									className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder:text-muted resize-none"
								/>
							</div>

							{/* Status Banner */}
							{status === "success" && (
								<div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
									<CheckCircle2 className="w-5 h-5 shrink-0" />
									<span>{statusMessage}</span>
								</div>
							)}

							{status === "error" && (
								<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
									<AlertCircle className="w-5 h-5 shrink-0" />
									<span>{statusMessage}</span>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={status === "loading"}
								className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{status === "loading" ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>Transmitting Message...</span>
									</>
								) : (
									<>
										<Send className="w-4 h-4" />
										<span>Send Message Securely</span>
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
