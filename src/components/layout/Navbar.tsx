'use client'

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogInLinkButton, SignOutButton } from "@/components/Buttons";
import ProfilePicture from "@/components/ProfilePicture";
import { User } from '@/lib/types';

type DropdownMenu = {
	label: string;
	items: {
		name: string;
		href: string;
		requiresAuth?: boolean;
		permission?: string;
	}[];
};

export default function Navbar() {
	const pathName = usePathname();
	const { session, isAuthenticated, hasHoldingsReadAccess, hasAdminDashboardAccess } = useAuth();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Refs for click-away detection
	const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const profileDropdownRef = useRef<HTMLDivElement | null>(null);

	const menus: DropdownMenu[] = [
		{
			label: "Portfolio & Research",
			items: [
				{ name: "Portfolio", href: "/holdings", requiresAuth: true, permission: "HOLDINGS_READ" },
				{ name: "Stock Pitches", href: "/pitches", requiresAuth: true, permission: "HOLDINGS_READ" },
			],
		},
		{
			label: "Club",
			items: [
				{ name: "Newsletter", href: "/newsletter" },
				{ name: "Meeting Minutes", href: "/notes" },
				{ name: "Guest Speakers", href: "/events" },
				{ name: "Gallery", href: "/gallery" },
			],
		},
		{
			label: "About",
			items: [
				{ name: "About Us", href: "/about" },
				{ name: "Contact", href: "/contact" },
			],
		},
	];

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Close menu dropdowns
			if (openMenu && dropdownRefs.current[openMenu] && !dropdownRefs.current[openMenu]?.contains(event.target as Node)) {
				setOpenMenu(null);
			}

			// Close profile dropdown
			if (isProfileOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [openMenu, isProfileOpen]);

	// Close dropdowns when escape key is pressed
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpenMenu(null);
				setIsProfileOpen(false);
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
		// Close any open menu dropdown when opening profile
		if (!isProfileOpen) {
			setOpenMenu(null);
		}
	};

	const toggleMenu = (label: string) => {
		// Close profile dropdown when opening a menu
		if (openMenu !== label) {
			setIsProfileOpen(false);
		}
		setOpenMenu(openMenu === label ? null : label);
	};

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	// Check if a menu item should be displayed based on authentication and permissions
	const shouldShowMenuItem = (item: DropdownMenu["items"][0]) => {
		if (item.requiresAuth && !isAuthenticated) return false;
		if (item.permission === "HOLDINGS_READ" && !hasHoldingsReadAccess()) return false;
		return true;
	};

	// Check if a menu should be displayed (if at least one item in it should be displayed)
	const shouldShowMenu = (menu: DropdownMenu) => {
		return menu.items.some(item => shouldShowMenuItem(item));
	};

	return (
		<nav className="w-full px-4 py-4 sm:px-8 flex items-center justify-between border-b border-white/[.145] font-[family-name:var(--font-geist-mono)]">
			<Link href="/" className="flex items-center">
				<Image src="/logo.svg" alt="SIF" width={50} height={50} />
			</Link>

			{/* Mobile menu button */}
			<button
				className="md:hidden p-2 focus:outline-none"
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<svg
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					{isMobileMenuOpen ? (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					) : (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					)}
				</svg>
			</button>

			{/* Desktop menu */}
			<div className="hidden md:flex items-center gap-4">
				{menus.map(
					(menu) =>
						shouldShowMenu(menu) && (
							<div
								key={menu.label}
								className="relative"
								ref={(el) => { dropdownRefs.current[menu.label] = el; }}
							>
								<button
									onClick={() => toggleMenu(menu.label)}
									className="flex items-center gap-1 px-3 py-2 hover:bg-gray-800 rounded-md"
								>
									{menu.label}
									<svg
										className={`h-4 w-4 transition-transform ${openMenu === menu.label ? "rotate-180" : ""}`}
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
								{openMenu === menu.label && (
									<div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-white/[.145]">
										{menu.items.map(
											(item) =>
												shouldShowMenuItem(item) && (
													<Link
														key={item.name}
														href={item.href}
														className={`block px-4 py-2 hover:bg-gray-700 ${pathName?.startsWith(item.href)
															? "text-blue-400"
															: ""
															}`}
														onClick={() => setOpenMenu(null)}
													>
														{item.name}
													</Link>
												)
										)}
									</div>
								)}
							</div>
						)
				)}

				{hasAdminDashboardAccess() && (
					<Link
						href="/admin"
						className="font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors px-3 py-2"
					>
						Admin
					</Link>
				)}

				{isAuthenticated ? (
					<div className="relative" ref={profileDropdownRef}>
						<button onClick={toggleProfile} className="flex items-center gap-2">
							<ProfilePicture
								user={session?.user as User}
								size={40}
								className="cursor-pointer"
							/>
						</button>

						{isProfileOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-white/[.145]">
								<Link
									href="/profile"
									className="block px-4 py-2 hover:bg-gray-700"
									onClick={() => setIsProfileOpen(false)}
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
			{isMobileMenuOpen && (
				<div className="absolute top-16 left-0 right-0 bg-gray-900 z-50 border-b border-white/[.145] md:hidden">
					<div className="px-4 py-2 space-y-2">
						{menus.map(
							(menu) =>
								shouldShowMenu(menu) && (
									<div key={menu.label} className="py-2">
										<button
											onClick={() => toggleMenu(menu.label)}
											className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-800 rounded-md"
										>
											{menu.label}
											<svg
												className={`h-4 w-4 transition-transform ${openMenu === menu.label ? "rotate-180" : ""}`}
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
										{openMenu === menu.label && (
											<div className="mt-1 pl-4 border-l border-gray-700">
												{menu.items.map(
													(item) =>
														shouldShowMenuItem(item) && (
															<Link
																key={item.name}
																href={item.href}
																className={`block px-4 py-2 hover:bg-gray-700 ${pathName?.startsWith(item.href)
																	? "text-blue-400"
																	: ""
																	}`}
																onClick={() => {
																	setOpenMenu(null);
																	setIsMobileMenuOpen(false);
																}}
															>
																{item.name}
															</Link>
														)
												)}
											</div>
										)}
									</div>
								)
						)}

						{hasAdminDashboardAccess() && (
							<Link
								href="/admin"
								className="block w-full text-left px-2 py-2 font-bold text-blue-600 hover:bg-gray-800 rounded-md"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Admin
							</Link>
						)}

						{isAuthenticated ? (
							<div>
								<Link
									href="/profile"
									className="block w-full text-left px-2 py-2 hover:bg-gray-800 rounded-md"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={() => {
										handleSignOut();
										setIsMobileMenuOpen(false);
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
								onClick={() => setIsMobileMenuOpen(false)}
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