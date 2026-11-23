"use client";

import React, { useState } from "react";
import { ProjectModal, ProjectData } from "./ProjectModal";
import {
	ArrowUpRight,
	Github,
	ExternalLink,
	Sparkles,
	Layers,
	Terminal,
} from "lucide-react";

interface ProjectsProps {
	projects?: ProjectData[];
}

export function Projects({ projects = [] }: ProjectsProps) {
	const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
		null,
	);

	const parseTech = (techString: string): string[] => {
		try {
			return JSON.parse(techString);
		} catch {
			return [];
		}
	};

	return (
		<section
			id="projects"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
							<span>03 | A FEW THINGS I'VE BUILT</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
							Things I've Brought to Life.
						</h2>
						<p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
							Production full-stack platforms, virtualized high-frequency
							dashboards, and applied AI systems built with Next.js, TypeScript,
							Python, and modern databases.
						</p>
					</div>
				</div>

				{/* Editorial Layout: First 2 Asymmetric Featured Projects */}
				<div className="space-y-10 mb-12">
					{projects.slice(0, 2).map((project, idx) => {
						const techs = parseTech(project.technologies);
						const isEven = idx % 2 === 0;

						return (
							<div
								key={project.id}
								className="group relative rounded-3xl bg-surface border border-surface-border hover:border-purple-500/40 p-6 sm:p-10 transition-all duration-300 shadow-sm hover:shadow-glow-sm"
							>
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
									{/* Project Info */}
									<div
										className={`lg:col-span-7 ${isEven ? "order-1" : "order-1 lg:order-2"}`}
									>
										<div className="flex items-center gap-3 mb-4">
											<span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
												{project.status}
											</span>
											<span className="text-xs font-mono text-secondary">
												Case Study 0{idx + 1}
											</span>
										</div>

										<h3 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-3 group-hover:text-purple-400 transition-colors">
											{project.title}
										</h3>

										<p className="text-sm sm:text-base text-secondary leading-relaxed mb-6">
											{project.summary}
										</p>

										{/* Tech chips */}
										<div className="flex flex-wrap gap-2 mb-8">
											{techs.slice(0, 5).map((tech, i) => (
												<span
													key={i}
													className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-surface-elevated border border-surface-border text-primary"
												>
													{tech}
												</span>
											))}
										</div>

										{/* Actions */}
										<div className="flex items-center gap-4">
											<button
												onClick={() => setSelectedProject(project)}
												className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-glow-sm"
											>
												<span>Case Study Details</span>
												<ArrowUpRight className="w-4 h-4" />
											</button>

											{project.githubUrl && (
												<a
													href={project.githubUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-elevated text-primary text-xs sm:text-sm font-medium hover:border-purple-500/40 transition-colors"
												>
													<Github className="w-4 h-4" />
													<span>GitHub</span>
												</a>
											)}
										</div>
									</div>

									{/* Visual Preview / Minimal Editorial Canvas */}
									<div
										className={`lg:col-span-5 ${isEven ? "order-2" : "order-2 lg:order-1"}`}
									>
										<div
											onClick={() => setSelectedProject(project)}
											className="cursor-pointer relative aspect-[16/10] rounded-2xl bg-gradient-to-br from-surface-elevated via-surface to-purple-950/20 border border-surface-border p-6 flex flex-col justify-between overflow-hidden group-hover:border-purple-500/50 transition-all duration-300"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-1.5">
													<span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
													<span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
													<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
												</div>
												<span className="text-[11px] font-mono text-secondary">
													{idx === 0
														? "Full-Stack Architecture"
														: "Digital Twin Simulation"}
												</span>
											</div>

											<div className="py-4">
												<div className="text-xs font-mono text-purple-400 mb-1">
													System Highlight:
												</div>
												<p className="text-xs text-secondary line-clamp-3">
													{project.problemSolved || project.description}
												</p>
											</div>

											<div className="flex items-center justify-between text-xs text-secondary font-mono pt-3 border-t border-surface-border/50">
												<span>Click to view breakdown</span>
												<ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* 4 Additional Grid Projects */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{projects.slice(2).map((project, idx) => {
						const techs = parseTech(project.technologies);

						return (
							<div
								key={project.id}
								className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-sm group"
							>
								<div>
									<div className="flex items-center justify-between mb-4">
										<span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
											{project.status}
										</span>
										<span className="text-xs font-mono text-secondary">
											0{idx + 3}
										</span>
									</div>

									<h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
										{project.title}
									</h3>

									<p className="text-xs sm:text-sm text-secondary leading-relaxed mb-6">
										{project.summary}
									</p>

									<div className="flex flex-wrap gap-1.5 mb-6">
										{techs.slice(0, 4).map((tech, i) => (
											<span
												key={i}
												className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-surface-elevated border border-surface-border text-primary"
											>
												{tech}
											</span>
										))}
									</div>
								</div>

								<div className="pt-4 border-t border-surface-border flex items-center justify-between">
									<button
										onClick={() => setSelectedProject(project)}
										className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
									>
										<span>Read Architecture Specs</span>
										<ArrowUpRight className="w-3.5 h-3.5" />
									</button>

									{project.githubUrl && (
										<a
											href={project.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="p-2 rounded-full border border-surface-border text-secondary hover:text-primary transition-colors"
											title="View GitHub Repository"
										>
											<Github className="w-3.5 h-3.5" />
										</a>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Case Study Modal */}
			<ProjectModal
				project={selectedProject}
				onClose={() => setSelectedProject(null)}
			/>
		</section>
	);
}
