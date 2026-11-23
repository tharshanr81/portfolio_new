"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface ExperienceItem {
	id: string;
	role: string;
	company: string;
	location?: string | null;
	startDate: string;
	endDate?: string | null;
	isCurrent: boolean;
	description: string;
	responsibilities?: string | null;
}

interface ExperienceProps {
	experiences?: ExperienceItem[];
}

export function Experience({ experiences = [] }: ExperienceProps) {
	const parseResponsibilities = (resp?: string | null): string[] => {
		if (!resp) return [];
		try {
			return JSON.parse(resp);
		} catch {
			return [resp];
		}
	};

	return (
		<section
			id="experience"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col items-start mb-16">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
						<span>04 | PLACES I'VE LEARNED & WORKED</span>
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
						Professional experience & internships.
					</h2>
					<p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
						Industry internships and production deliverables across frontend
						engineering, UI/UX prototyping, and web systems.
					</p>
				</div>

				{/* Timeline */}
				<div className="relative border-l border-surface-border ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
					{experiences.map((exp, idx) => {
						const respList = parseResponsibilities(exp.responsibilities);

						return (
							<div key={exp.id} className="relative group">
								{/* Timeline Dot */}
								<div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-purple-500 group-hover:scale-125 transition-transform" />

								<div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border hover:border-purple-500/30 transition-all duration-300 shadow-sm">
									{/* Top Bar: Role, Company, Period */}
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
										<div>
											<h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
												{exp.role}
											</h3>
											<div className="text-base font-semibold text-purple-500 mt-0.5">
												{exp.company}
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary">
											<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border">
												<Calendar className="w-3.5 h-3.5 text-purple-400" />
												<span>
													{exp.startDate} –{" "}
													{exp.isCurrent ? "Present" : exp.endDate}
												</span>
											</div>
											{exp.location && (
												<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border">
													<MapPin className="w-3.5 h-3.5 text-cyan-400" />
													<span>{exp.location}</span>
												</div>
											)}
										</div>
									</div>

									{/* Narrative Summary */}
									<p className="text-sm sm:text-base text-secondary leading-relaxed mb-6">
										{exp.description}
									</p>

									{/* Bullet Responsibilities */}
									{respList.length > 0 && (
										<div className="space-y-2.5 pt-4 border-t border-surface-border/60">
											<h4 className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
												Key Impact & Responsibilities:
											</h4>
											{respList.map((resp, i) => (
												<div
													key={i}
													className="flex items-start gap-2.5 text-xs sm:text-sm text-secondary"
												>
													<CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
													<span>{resp}</span>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
