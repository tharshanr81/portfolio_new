"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="border-t border-surface-border bg-canvas py-12 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					{/* Brand & Copyright */}
					<div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
						<div className="w-7 h-7 rounded-2xl bg-gradient-to-l from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-glow-sm">
							T
						</div>
						<div>
							<div className="text-sm font-semibold text-primary">
								Tharshan R
							</div>
							<p className="text-xs text-secondary">
								© {new Date().getFullYear()} Tharshan R. All rights reserved.
							</p>
						</div>
					</div>

					{/* Social Links & Back to Top */}
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/tharshanr81"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full border border-surface-border text-secondary hover:text-primary hover:bg-surface transition-colors"
							title="GitHub Profile"
						>
							<Github className="w-4 h-4" />
						</a>

						<a
							href="https://www.linkedin.com/in/tharshanr81/"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full border border-surface-border text-secondary hover:text-primary hover:bg-surface transition-colors"
							title="LinkedIn Profile"
						>
							<Linkedin className="w-4 h-4" />
						</a>

						<a
							href="mailto:tharshanr7878@gmail.com"
							className="p-2 rounded-full border border-surface-border text-secondary hover:text-primary hover:bg-surface transition-colors"
							title="Direct Email"
						>
							<Mail className="w-4 h-4" />
						</a>

						<Link
							href="/admin"
							className="p-2 rounded-full border border-surface-border text-secondary hover:text-purple-400 hover:bg-surface transition-colors"
							title="Admin CMS Management"
						>
							<ShieldCheck className="w-4 h-4" />
						</Link>

						<button
							onClick={scrollToTop}
							className="inline-flex items-center justify-center p-2 rounded-full border border-surface-border bg-surface hover:bg-surface-elevated text-secondary hover:text-primary transition-colors ml-2"
							title="Back to Top"
							aria-label="Back to Top"
						>
							<ArrowUp className="w-4 h-4 text-purple-400" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
