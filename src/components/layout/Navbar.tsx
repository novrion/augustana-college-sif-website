'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogInLinkButton, SignOutButton } from "@/components/Buttons";
import ProfilePicture from "@/components/ProfilePicture";
import { User } from '@/lib/types';

// Define consistent types
interface MenuItem {
	name: string;
	href: string;
	requiresAuth?: boolean;
	visible: boolean;
}

interface Menu {
	label: string;
	items: MenuItem[];
	visible: boolean;
}

export default function Navbar() {
	const pathName = usePathname();
	const { session, isAuthenticated, hasHoldingsReadAccess, hasAdminDashboardAccess } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	// Close mobile menu and dropdown when route changes
	useEffect(() => {
		setMobileMenuOpen(false);
		setActiveDropdown(null);
	}, [pathName]);

	const menus: Menu[] = [
		{
			label: "Portfolio & Research",
			items: [
				{
					name: "Portfolio",
					href: "/holdings",
					requiresAuth: true,
					visible: hasHoldingsReadAccess()
				},
				{
					name: "Stock Pitches",
					href: "/pitches",
					requiresAuth: true,
					visible: hasHoldingsReadAccess()
				},
			],
			visible: hasHoldingsReadAccess(),
		},
		{
			label: "Club",
			items: [
				{ name: "Newsletter", href: "/newsletter", visible: true },
				{ name: "Meeting Minutes", href: "/notes", visible: true },
				{ name: "Guest Speakers", href: "/events", visible: true },
				{ name: "Gallery", href: "/gallery", visible: true },
			],
			visible: true,
		},
		{
			label: "About",
			items: [
				{ name: "About Us", href: "/about", visible: true },
				{ name: "Contact", href: "/contact", visible: true },
			],
			visible: true,
		},
	];

	const toggleDropdown = (label: string) => {
		// If clicking the already active dropdown, close it
		if (activeDropdown === label) {
			setActiveDropdown(null);
		}
		// Otherwise, switch to the new dropdown
		else {
			setActiveDropdown(label);
		}
	};

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<nav className="w-full px-4 py-4 sm:px-8 flex items-center justify-between border-b border-white/[.145] font-[family-name:var(--font-geist-mono)] bg-black">
			<Link href="/" className="flex items-center">
				<Image src="/logo.svg" alt="SIF" width={50} height={50} />
			</Link>

			{/* Mobile menu button */}
			<button
				className="md:hidden p-2 focus:outline-none"
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<svg
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					{mobileMenuOpen ? (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					) : (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					)}
				</svg>
			</button>

			{/* Desktop menu */}
			<div className="hidden md:flex items-center gap-4">
				{menus.filter(menu => menu.visible).map((menu) => (
					<div key={menu.label} className="relative">
						<button
							onClick={() => toggleDropdown(menu.label)}
							className="flex items-center gap-1 px-3 py-2 hover:bg-gray-800 rounded-md"
						>
							{menu.label}
							<svg
								className={`h-4 w-4 transition-transform ${activeDropdown === menu.label ? "rotate-180" : ""}`}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>

						{activeDropdown === menu.label && (
							<div
								className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-white/[.145]"
							>
								{menu.items.filter(item => item.visible && (!item.requiresAuth || isAuthenticated)).map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={`block px-4 py-2 hover:bg-gray-700 ${pathName?.startsWith(item.href) ? "text-blue-400" : ""
											}`}
									>
										{item.name}
									</Link>
								))}
							</div>
						)}
					</div>
				))}

				{hasAdminDashboardAccess() && (
					<Link
						href="/admin"
						className="font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors px-3 py-2"
					>
						Admin
					</Link>
				)}

				{isAuthenticated ? (
					<div className="relative">
						<button
							onClick={() => toggleDropdown("profile")}
							className="flex items-center gap-2"
						>
							<ProfilePicture
								user={session?.user as User}
								size={40}
								className="cursor-pointer"
							/>
						</button>

						{activeDropdown === "profile" && (
							<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-white/[.145]">
								<Link
									href="/profile"
									className="block px-4 py-2 hover:bg-gray-700"
								>
									Profile
								</Link>
								<SignOutButton onClick={handleSignOut} />
							</div>
						)}
					</div>
				) : (
					<LogInLinkButton />
				)}
			</div>

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="absolute top-16 left-0 right-0 bg-gray-900 z-50 border-b border-white/[.145] md:hidden">
					<div className="px-4 py-2 space-y-2">
						{menus.filter(menu => menu.visible).map((menu) => (
							<div key={menu.label} className="py-2">
								<button
									onClick={() => toggleDropdown(menu.label)}
									className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-800 rounded-md"
								>
									{menu.label}
									<svg
										className={`h-4 w-4 transition-transform ${activeDropdown === menu.label ? "rotate-180" : ""}`}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>

								{activeDropdown === menu.label && (
									<div className="mt-1 pl-4 border-l border-gray-700">
										{menu.items.filter(item => item.visible && (!item.requiresAuth || isAuthenticated)).map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className={`block px-4 py-2 hover:bg-gray-700 ${pathName?.startsWith(item.href) ? "text-blue-400" : ""
													}`}
												onClick={() => setMobileMenuOpen(false)}
											>
												{item.name}
											</Link>
										))}
									</div>
								)}
							</div>
						))}

						{hasAdminDashboardAccess() && (
							<Link
								href="/admin"
								className="block w-full text-left px-2 py-2 font-bold text-blue-600 hover:bg-gray-800 rounded-md"
								onClick={() => setMobileMenuOpen(false)}
							>
								Admin
							</Link>
						)}

						{isAuthenticated ? (
							<div>
								<Link
									href="/profile"
									className="block w-full text-left px-2 py-2 hover:bg-gray-800 rounded-md"
									onClick={() => setMobileMenuOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={() => {
										handleSignOut();
										setMobileMenuOpen(false);
									}}
									className="block w-full text-left px-2 py-2 text-red-500 hover:bg-gray-800 rounded-md"
								>
									Sign out
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className="block w-full text-left px-2 py-2 text-blue-600 hover:bg-gray-800 rounded-md"
								onClick={() => setMobileMenuOpen(false)}
							>
								Log in
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}