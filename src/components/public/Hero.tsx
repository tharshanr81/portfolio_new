"use client";

import React from "react";
import Image from "next/image";
import {
	ArrowDownRight,
	FolderGit2,
	Mail,
	FileDown,
	Sparkles,
	Terminal,
	Code2,
} from "lucide-react";

interface HeroProps {
	name?: string;
	role?: string;
	headline?: string;
	bio?: string;
	avatarUrl?: string | null;
	resumeUrl?: string | null;
	isAvailable?: boolean;
}

export function Hero({
	name = "Tharshan R",
	role = "Frontend & Full-Stack Developer",
	headline = "Architecting Resilient Digital Products & Intelligent Systems",
	bio = "B.Tech (Honours) Artificial Intelligence & Data Science graduate. Building production-grade web applications, real-time virtualized dashboards, and machine learning pipelines.",
	avatarUrl = "/uploads/avatar.png",
	resumeUrl = "/resume.pdf",
	isAvailable = true,
}: HeroProps) {
	return (
		<section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
			<div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
					<div className="lg:col-span-7 flex flex-col items-start text-left">
						<h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight text-primary leading-[1.3] mb-6">
							<span className="block mb-2">Engineering with precision.</span>

							<span className="block pb-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent hero-gradient">
								Designing with purpose.
							</span>
						</h1>

						<div className="flex flex-row flex-wrap items-start gap-3 mt-8 mb-7">
							<span className="text-xl sm:text-[46px] font-semibold text-primary italic font-torken">
								THARSHAN R
							</span>

							<span className="text-sm sm:text-base font-semibold px-2.5 py-1 rounded-md border border-surface-border bg-slate-400 font-mono text-gray-800 dark:text-gray-200 dark:bg-slate-800">
								{"-->"} {role}
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
							<a
								href="#projects"
								className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:opacity-90 text-white font-medium text-sm transition-all duration-300 shadow-glow-sm hover:shadow-glow-md group"
							>
								<span>Explore Featured Work</span>
								<ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
							</a>

							<a
								href="#contact"
								className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-surface-border bg-surface hover:bg-surface-elevated text-primary font-medium text-sm transition-all duration-300 hover:border-purple-500/40"
							>
								<Mail className="w-4 h-4 text-purple-500" />
								<span>Get in Touch</span>
							</a>

							<a
								href={resumeUrl || "/resume.pdf"}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary font-medium text-sm transition-all duration-300"
							>
								<FileDown className="w-4 h-4" />
								<span>Download CV</span>
							</a>
						</div>

						<div className="grid grid-cols-3 gap-6 pt-10 mt-8 border-t border-surface-border w-full max-w-lg">
							<div>
								<div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
									7+
								</div>
								<div className="text-xs text-secondary mt-1">
									Projects Built
								</div>
							</div>
							<div>
								<div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
									1
								</div>
								<div className="text-xs text-secondary mt-1">
									Project Excellence Award
								</div>
							</div>
							<div>
								<div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
									7.69
								</div>
								<div className="text-xs text-secondary mt-1">
									B.Tech AI & DS CGPA
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-5 flex justify-center lg:justify-end">
						<div className="relative w-72 sm:w-84 md:w-96 aspect-square group">
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/20 blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-70" />

							<div className="relative w-full h-full rounded-3xl border border-surface-border bg-surface/80 backdrop-blur-xl p-3 shadow-2xl overflow-hidden flex flex-col justify-end">
								<div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-purple-900/10 to-purple-950/40">
									<Image
										src={avatarUrl || "/uploads/avatar.png"}
										alt={name}
										fill
										sizes="(max-width: 768px) 100vw, 400px"
										className="object-cover object-top filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
										priority
									/>
								</div>

								<div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-md border border-surface-border shadow-lg text-xs font-mono text-primary">
									<Code2 className="w-3.5 h-3.5 text-purple-500" />
									<span>React · Next.js · TS</span>
								</div>

								<div className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-md border border-surface-border shadow-lg text-xs font-mono text-primary">
									<Sparkles className="w-3.5 h-3.5 text-cyan-400" />
									<span>AI & Data Science</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
