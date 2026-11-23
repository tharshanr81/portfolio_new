"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, X, ArrowUpRight, FileDown, ShieldCheck } from "lucide-react";

interface NavbarProps {
	isAvailable?: boolean;
	resumeUrl?: string | null;
}

export function Navbar({ isAvailable = true, resumeUrl }: NavbarProps) {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 40);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ name: "About", href: "#about" },
		{ name: "Skills", href: "#skills" },
		{ name: "Projects", href: "#projects" },
		{ name: "Experience", href: "#experience" },
		{ name: "Certificates", href: "#certificates" },
		{ name: "Education", href: "#education" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "py-3 bg-canvas/80 backdrop-blur-xl border-b border-surface-border shadow-sm"
					: "py-5 bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 group focus:outline-none"
					></Link>

					{/* Desktop Nav Links */}
					<nav className="hidden md:flex items-center gap-1 lg:gap-2">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="nav-link px-3 py-1.5 text-sm font-medium text-secondary rounded-full transition-all duration-300"
							>
								<span>{link.name}</span>
							</a>
						))}
					</nav>

					{/* Right Action Items */}
					<div className="hidden md:flex items-center gap-3">
						{/* Status Pill */}
						{isAvailable && (
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
								</span>
								<span>Available</span>
							</div>
						)}

						{/* Resume Button */}
						<a
							href={resumeUrl || "/resume.pdf"}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-surface-border bg-surface hover:bg-surface-elevated text-primary transition-all duration-200 hover:border-purple-500/50 shadow-sm"
						>
							<FileDown className="w-3.5 h-3.5 text-purple-500" />
							<span>Resume</span>
						</a>

						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Admin Quick Link */}
						<Link
							href="/admin"
							className="p-2 rounded-full border border-surface-border text-secondary hover:text-primary hover:bg-surface transition-colors"
							title="Admin Portal"
						>
							<ShieldCheck className="w-4 h-4 text-purple-400" />
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className="flex md:hidden items-center gap-2">
						<ThemeToggle />
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="p-2 rounded-lg border border-surface-border bg-surface text-primary hover:bg-surface-elevated focus:outline-none"
							aria-label="Toggle navigation menu"
						>
							{mobileOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Drawer */}
			{mobileOpen && (
				<div className="md:hidden border-b border-surface-border bg-canvas/95 backdrop-blur-2xl px-6 py-6 transition-all duration-300">
					<div className="flex flex-col gap-3">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className="text-base font-medium text-secondary hover:text-purple-400 py-1 transition-colors"
							>
								{link.name}
							</a>
						))}
						<div className="pt-4 border-t border-surface-border flex items-center justify-between">
							<a
								href={resumeUrl || "/resume.pdf"}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-purple-600 text-white shadow-glow-sm"
							>
								<FileDown className="w-4 h-4" />
								<span>Download CV</span>
							</a>
							<Link
								href="/admin"
								onClick={() => setMobileOpen(false)}
								className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-purple-400"
							>
								<ShieldCheck className="w-4 h-4" />
								<span>Admin CMS</span>
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
