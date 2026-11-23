"use client";

import React from "react";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";

interface EducationItem {
	id: string;
	institution: string;
	degree: string;
	fieldOfStudy: string;
	score?: string | null;
	startDate: string;
	endDate?: string | null;
	description?: string | null;
}

interface EducationProps {
	educations?: EducationItem[];
}

export function Education({ educations = [] }: EducationProps) {
	return (
		<section
			id="education"
			className="py-24 relative border-t border-surface-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col items-start mb-16">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-500 bg-purple-500/10 border border-purple-500/20 mb-3">
						<span>06 | MY ACADEMIC JOURNEY</span>
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
						Academic qualifications & foundation.
					</h2>
					<p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
						Rigorous undergraduate engineering curriculum with Honours
						specialization in Artificial Intelligence & Data Science.
					</p>
				</div>

				{/* Education Editorial Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{educations.map((edu, idx) => (
						<div
							key={edu.id}
							className="p-8 rounded-3xl bg-surface border border-surface-border hover:border-purple-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between group"
						>
							<div>
								<div className="flex items-center justify-between gap-4 mb-4">
									<div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-purple-500">
										<GraduationCap className="w-5 h-5" />
									</div>
									<div className="flex items-center gap-2">
										{edu.score && (
											<span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
												{edu.score}
											</span>
										)}
										<span className="text-xs font-mono text-secondary">
											{edu.startDate} – {edu.endDate || "Present"}
										</span>
									</div>
								</div>

								<h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight mb-1 group-hover:text-purple-400 transition-colors">
									{edu.degree}
								</h3>

								<div className="text-sm font-semibold text-purple-400 mb-2">
									{edu.fieldOfStudy}
								</div>

								<p className="text-xs sm:text-sm font-medium text-secondary mb-4">
									{edu.institution}
								</p>

								{edu.description && (
									<p className="text-xs sm:text-sm text-secondary leading-relaxed pt-4 border-t border-surface-border/60">
										{edu.description}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
