"use client";

import React from "react";
import {
	X,
	ExternalLink,
	Github,
	CheckCircle,
	Server,
	AlertCircle,
} from "lucide-react";

export interface ProjectData {
	id: string;
	title: string;
	slug: string;
	summary: string;
	description: string;
	problemSolved?: string | null;
	architecture?: string | null;
	keyFeatures: string; // JSON string or text
	technologies: string; // JSON string
	thumbnail?: string | null;
	images?: string | null;
	githubUrl?: string | null;
	liveUrl?: string | null;
	status: string;
	featured: boolean;
}

interface ProjectModalProps {
	project: ProjectData | null;
	onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
	if (!project) return null;

	let features: string[] = [];
	try {
		features = JSON.parse(project.keyFeatures);
	} catch {
		features = project.keyFeatures ? [project.keyFeatures] : [];
	}

	let techs: string[] = [];
	try {
		techs = JSON.parse(project.technologies);
	} catch {
		techs = project.technologies ? [project.technologies] : [];
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
				onClick={onClose}
			/>

			{/* Modal Dialog */}
			<div className="relative w-full max-w-3xl bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-6 right-6 p-2 rounded-full border border-surface-border bg-surface-elevated text-secondary hover:text-primary transition-colors focus:outline-none"
					aria-label="Close case study"
				>
					<X className="w-5 h-5" />
				</button>

				{/* Status Pill & Title */}
				<div className="flex items-center gap-3 mb-3">
					<span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
						{project.status}
					</span>
					{project.featured && (
						<span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
							Featured Case Study
						</span>
					)}
				</div>

				<h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-3">
					{project.title}
				</h3>

				<p className="text-base text-secondary leading-relaxed mb-6">
					{project.summary}
				</p>

				{/* Tech Stack Badges */}
				<div className="flex flex-wrap gap-2 mb-8">
					{techs.map((tech, idx) => (
						<span
							key={idx}
							className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-surface-elevated border border-surface-border text-primary"
						>
							{tech}
						</span>
					))}
				</div>

				{/* Detailed Sections */}
				<div className="space-y-6 text-sm sm:text-base">
					{/* Deep Description */}
					<div className="p-5 rounded-2xl bg-surface-elevated/50 border border-surface-border">
						<h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
							<Server className="w-4 h-4 text-purple-500" />
							<span>Project Overview & Engineering</span>
						</h4>
						<p className="text-secondary leading-relaxed text-sm">
							{project.description}
						</p>
					</div>

					{/* Problem Solved */}
					{project.problemSolved && (
						<div className="p-5 rounded-2xl bg-surface-elevated/50 border border-surface-border">
							<h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
								<AlertCircle className="w-4 h-4 text-cyan-400" />
								<span>The Challenge & Problem Solved</span>
							</h4>
							<p className="text-secondary leading-relaxed text-sm">
								{project.problemSolved}
							</p>
						</div>
					)}

					{/* Key Features */}
					{features.length > 0 && (
						<div>
							<h4 className="text-sm font-semibold text-primary mb-3">
								Key Features & Capabilities:
							</h4>
							<div className="grid grid-cols-1 gap-2.5">
								{features.map((feat, idx) => (
									<div
										key={idx}
										className="flex items-start gap-2.5 text-xs sm:text-sm text-secondary"
									>
										<CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
										<span>{feat}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Architecture */}
					{project.architecture && (
						<div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 text-xs text-secondary font-mono">
							<span className="text-primary font-semibold text-sm shrink-0">
								Architecture:
							</span>
							<span className="text-primary font-medium text-sm leading-relaxed">
								{project.architecture}
							</span>
						</div>
					)}
				</div>

				{/* Action Links */}
				<div className="flex items-center gap-4 pt-8 mt-8 border-t border-surface-border">
					{project.githubUrl && (
						<a
							href={project.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-elevated border border-surface-border text-primary font-medium text-xs sm:text-sm hover:border-purple-500/40 transition-colors"
						>
							<Github className="w-4 h-4" />
							<span>View Repository</span>
						</a>
					)}

					{project.liveUrl ? (
						<a
							href={project.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm shadow-glow-sm transition-all"
						>
							<ExternalLink className="w-4 h-4" />
							<span>Launch Live Demo</span>
						</a>
					) : (
						<span className="text-xs text-muted font-mono italic">
							No live demo available due to (inprocess or private) nature of the
							project.
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
