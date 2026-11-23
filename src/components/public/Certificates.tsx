"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
	Award,
	ExternalLink,
	Eye,
	X,
	CheckCircle,
	FileText,
} from "lucide-react";

interface CertificateItem {
	id: string;
	title: string;
	issuer: string;
	issueDate: string;
	credentialUrl?: string | null;
	fileUrl?: string | null;
	category: string;
}

interface CertificatesProps {
	certificates?: CertificateItem[];
}

export function Certificates({ certificates = [] }: CertificatesProps) {
	const [activeCategory, setActiveCategory] = useState<string>("All");
	const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);

	const categories = [
		"All",
		"Experience",
		"Web",
		"Python",
		"UI/UX",
		"Achievements",
	];

	const filteredCerts =
		activeCategory === "All"
			? certificates
			: certificates.filter(
					(c) => c.category.toLowerCase() === activeCategory.toLowerCase(),
				);

	return (
		<section
			id="certificates"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
							<span>05 | LEARNING & GROWTH</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
							Certifications & competition achievements.
						</h2>
						<p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
							Verified certifications from Zetheta Algorithms, Rinex, IIT Madras
							NPTEL, Scaler, Infosys, and Unstop hackathon wins.
						</p>
					</div>

					{/* Filter Pills */}
					<div className="flex items-center flex-wrap gap-2 mt-6 md:mt-0">
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat)}
								className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
									activeCategory === cat
										? "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white shadow-glow-sm"
										: "bg-surface border border-surface-border text-secondary hover:text-primary hover:bg-surface-elevated"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* Certificate Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCerts.map((cert) => (
						<div
							key={cert.id}
							className="p-6 rounded-3xl bg-surface border border-surface-border hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-sm group"
						>
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
										{cert.category}
									</span>
									<span className="text-xs font-mono text-secondary">
										{cert.issueDate}
									</span>
								</div>

								<h3 className="text-lg font-bold text-primary tracking-tight mb-1 group-hover:text-purple-400 transition-colors">
									{cert.title}
								</h3>

								<p className="text-xs text-secondary mb-4 font-medium">
									Issued by: <span className="text-primary">{cert.issuer}</span>
								</p>

								{/* Thumbnail if available */}
								{cert.fileUrl && (
									<div
										onClick={() => setPreviewCert(cert)}
										className="relative w-full h-36 rounded-xl overflow-hidden bg-surface-elevated border border-surface-border cursor-pointer group-hover:border-purple-500/50 transition-colors"
									>
										<Image
											src={cert.fileUrl}
											alt={cert.title}
											fill
											sizes="(max-width: 768px) 100vw, 300px"
											className="object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white text-xs font-semibold shadow-lg">
												<Eye className="w-3.5 h-3.5" />
												<span>Inspect Document</span>
											</span>
										</div>
									</div>
								)}
							</div>

							{/* Action Links */}
							<div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between">
								{cert.fileUrl ? (
									<button
										onClick={() => setPreviewCert(cert)}
										className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
									>
										<Eye className="w-3.5 h-3.5" />
										<span>View Certificate</span>
									</button>
								) : (
									<span className="text-xs text-muted font-mono">
										Verified Credential
									</span>
								)}

								{cert.credentialUrl && (
									<a
										href={cert.credentialUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="p-1.5 rounded-full border border-surface-border text-secondary hover:text-primary transition-colors"
										title="External Verification"
									>
										<ExternalLink className="w-3.5 h-3.5" />
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Certificate Lightbox Preview Modal */}
			{previewCert && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
					<div
						className="fixed inset-0 bg-black/80 backdrop-blur-md"
						onClick={() => setPreviewCert(null)}
					/>
					<div className="relative w-full max-w-4xl bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-border">
							<div>
								<h4 className="text-lg font-bold text-primary">
									{previewCert.title}
								</h4>
								<p className="text-xs text-secondary">
									{previewCert.issuer} · {previewCert.issueDate}
								</p>
							</div>
							<button
								onClick={() => setPreviewCert(null)}
								className="p-2 rounded-full border border-surface-border bg-surface-elevated text-secondary hover:text-primary"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{previewCert.fileUrl ? (
							<div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/20 border border-surface-border">
								<Image
									src={previewCert.fileUrl}
									alt={previewCert.title}
									fill
									sizes="100vw"
									className="object-contain"
								/>
							</div>
						) : (
							<div className="p-12 text-center text-secondary">
								Document file preview unavailable.
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
