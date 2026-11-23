"use client";

import React, { useState } from "react";
import {
	Code,
	Globe,
	Database,
	Cpu,
	Server,
	Wrench,
	CheckCircle2,
	Sparkles,
} from "lucide-react";

interface Skill {
	id: string;
	name: string;
	icon?: string | null;
	displayOrder: number;
}

interface SkillCategory {
	id: string;
	name: string;
	displayOrder: number;
	skills: Skill[];
}

interface SkillsProps {
	categories?: SkillCategory[];
}

export function Skills({ categories = [] }: SkillsProps) {
	const [activeTab, setActiveTab] = useState<string>("all");

	const getCategoryIcon = (name: string) => {
		switch (name.toLowerCase()) {
			case "frontend development":
				return <Globe className="w-4 h-4 text-purple-400" />;
			case "programming languages":
				return <Code className="w-4 h-4 text-cyan-400" />;
			case "backend & automation":
				return <Server className="w-4 h-4 text-emerald-400" />;
			case "databases & orm":
				return <Database className="w-4 h-4 text-indigo-400" />;
			case "ai, ml & analytics":
				return <Cpu className="w-4 h-4 text-pink-400" />;
			default:
				return <Wrench className="w-4 h-4 text-amber-400" />;
		}
	};

	const displayedCategories =
		activeTab === "all"
			? categories
			: categories.filter((c) => c.id === activeTab);

	return (
		<section
			id="skills"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
							<span>02 | What I Work With</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
							How I Bring Ideas to Life
						</h2>
						<p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
							Organized by architectural domain. Real skills grounded in
							production implementations, coursework, and competitive
							challenges.
						</p>
					</div>

					{/* Category Filter Pills */}
					<div className="flex items-center flex-wrap gap-2 mt-6 md:mt-0">
						<button
							onClick={() => setActiveTab("all")}
							className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
								activeTab === "all"
									? "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white shadow-glow-sm"
									: "bg-surface border border-surface-border text-secondary hover:text-primary hover:bg-surface-elevated"
							}`}
						>
							All Categories
						</button>
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveTab(cat.id)}
								className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
									activeTab === cat.id
										? "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white shadow-glow-sm"
										: "bg-surface border border-surface-border text-secondary hover:text-primary hover:bg-surface-elevated"
								}`}
							>
								{getCategoryIcon(cat.name)}
								<span>{cat.name}</span>
							</button>
						))}
					</div>
				</div>

				{/* Categories & Skills Matrix */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayedCategories.map((cat) => (
						<div
							key={cat.id}
							className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-purple-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between"
						>
							<div>
								<div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-surface-border">
									<div className="w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center">
										{getCategoryIcon(cat.name)}
									</div>
									<h3 className="font-semibold text-base text-primary">
										{cat.name}
									</h3>
								</div>

								{/* Skills Chips */}
								<div className="flex flex-wrap gap-2">
									{cat.skills.map((skill) => (
										<div
											key={skill.id}
											className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-surface-border/80 text-xs font-medium text-primary hover:border-purple-500/40 transition-colors"
										>
											<CheckCircle2 className="w-3.5 h-3.5 text-purple-500/80" />
											<span>{skill.name}</span>
										</div>
									))}
								</div>
							</div>

							<div className="mt-6 pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-secondary font-mono">
								<span>{cat.skills.length} verified technologies</span>
								<span className="text-purple-400">Production ready</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
