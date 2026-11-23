"use client";

import React from "react";
import {
	Layers,
	Cpu,
	ShieldCheck,
	Compass,
	GitBranch,
	Sparkles,
} from "lucide-react";

interface AboutProps {
	bio?: string;
	aboutDetails?: string | null;
}

export function About({ bio, aboutDetails }: AboutProps) {
	const pillars = [
		{
			icon: <Layers className="w-5 h-5 text-purple-500" />,
			title: "Full-Stack Web Development",
			description:
				"Building web applications using React, Next.js, TypeScript, and Tailwind CSS, with experience integrating REST APIs, Prisma ORM, PostgreSQL, and Supabase.",
		},
		{
			icon: <Cpu className="w-5 h-5 text-cyan-400" />,
			title: "Applied AI & Machine Learning",
			description:
				"Exploring practical AI solutions through machine learning, Random Forest classification, predictive analytics, and decision intelligence systems.",
		},
		{
			icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
			title: "UI Engineering & User Experience",
			description:
				"Creating responsive web interfaces with attention to visual consistency, reusable components, accessibility, and intuitive user experiences.",
		},
		{
			icon: <Compass className="w-5 h-5 text-amber-400" />,
			title: "Practical Problem Solving",
			description:
				"Applying technical knowledge through academic projects, internship assignments, database integration, debugging, and continuous exploration of modern technologies.",
		},
	];

	return (
		<section
			id="about"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col items-start mb-16">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
						<span>01 | A Little About Me</span>
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
						How I Think & Build.
					</h2>
				</div>

				{/* Editorial Narrative Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
					<div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-secondary leading-relaxed">
						<p>
							I am a final-year{" "}
							<strong className="text-primary font-semibold">
								B.Tech (Honours)
							</strong>{" "}
							student in{" "}
							<strong className="text-primary font-semibold">
								Artificial Intelligence & Data Science
							</strong>{" "}
							at Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering
							College, Chennai.
						</p>
						<p>
							My engineering approach sits at the intersection of{" "}
							<span className="text-purple-400 font-medium">
								modern web engineering
							</span>{" "}
							and{" "}
							<span className="text-cyan-400 font-medium">
								applied intelligence
							</span>
							. Rather than treating frontend and backend as separate silos, I
							build end-to-end applications where data integrity, server-side
							caching, fluid client reactivity, and user accessibility harmonize
							seamlessly.
						</p>
						<p>
							During my Frontend Developer internship at{" "}
							<strong className="text-primary font-semibold">
								Zetheta Algorithms Pvt. Ltd.{" "}
							</strong>{" "}
							I developed a Stock Screener dashboard using sample stock market
							data, focusing on efficient data rendering and a responsive user
							experience. I worked with virtualized windowing to handle over
							5,000 stock records smoothly. Alongside this, my capstone project
							explored Digital Twin simulation and predictive decision
							intelligence for industrial operations.
						</p>
					</div>

					<div className="lg:col-span-5 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 relative shadow-sm">
						<div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-border">
							<div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
								<Sparkles className="w-5 h-5" />
							</div>
							<div>
								<h4 className="text-base font-semibold text-primary">
									Quick Facts
								</h4>
								<p className="text-xs text-secondary">Education & Experience</p>
							</div>
						</div>

						<div className="space-y-4 text-sm font-mono">
							<div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
								<span className="text-secondary">Degree</span>
								<span className="text-primary font-medium">
									B.Tech AI & DS (Honours)
								</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
								<span className="text-secondary">Graduation</span>
								<span className="text-primary font-medium">
									2027 (Vel Tech High Tech)
								</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
								<span className="text-secondary">CGPA</span>
								<span className="text-purple-400 font-semibold">
									7.69 / 10.0
								</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
								<span className="text-secondary">Current Location</span>
								<span className="text-primary font-medium">Chennai, India</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
								<span className="text-secondary">Native Location</span>
								<span className="text-primary font-medium">
									Kanyakumari, India
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-secondary">Key Specialization</span>
								<span className="text-primary font-medium">
									AI & Full-Stack Web Development
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* 4 Architectural Pillars */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{pillars.map((p, idx) => (
						<div
							key={idx}
							className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-sm"
						>
							<div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
								{p.icon}
							</div>
							<h3 className="text-base font-semibold text-primary mb-2">
								{p.title}
							</h3>
							<p className="text-xs sm:text-sm text-secondary leading-relaxed">
								{p.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
