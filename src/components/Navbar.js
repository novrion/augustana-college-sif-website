'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const { data: session, status } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const pathname = usePathname();

	const hasAdminAccess = session?.user?.role === 'admin' || session?.user?.role === 'president' || session?.user?.role === 'vice_president';
	const hasPortfolioAccess = hasAdminAccess || session?.user?.role === 'portfolio-access';

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<nav className="w-full px-8 py-4 sm:px-18 flex items-center justify-between border-b border-black/[.08] dark:border-white/[.145] font-[family-name:var(--font-geist-mono)]">
			<Link href="/" className="font-bold text-xl flex items-center gap-2">
				<Image
					src="/logo.svg"
					alt="LOGO"
					width={60}
					height={60}
				/>
			</Link>

			<div className="hidden sm:flex items-center gap-8">
				{hasPortfolioAccess ? (
					<Link
						href="/portfolio"
						className={`relative px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 group transition-all duration-300 ${pathname?.startsWith('/portfolio') ? 'shadow-md' : 'hover:shadow-md'
							}`}
					>
						<span className="font-medium text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors">
							Portfolio
						</span>
						{pathname?.startsWith('/portfolio') && (
							<span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></span>
						)}
					</Link>
				) : (
					<span className="opacity-50 px-4 py-1.5 text-gray-500">Portfolio</span>
				)}

				<Link href="/calendar" className="hover:underline">Calendar</Link>
				<Link href="/newsletter" className="hover:underline">Newsletter</Link>
				<Link href="/contact" className="hover:underline">Contact</Link>
				<Link href="/about" className="hover:underline">About</Link>

				{hasAdminAccess && (
					<Link href="/admin" className="font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors">
						Admin
					</Link>
				)}

				{status === 'authenticated' ? (
					<div className="relative">
						<button
							onClick={toggleProfile}
							className="cursor-pointer flex items-center gap-2 hover:underline"
						>
							<span className="font-semibold text-blue-600">{session.user.name}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>

						{isProfileOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-black/[.08] dark:border-white/[.145]">
								<Link
									href="/profile"
									className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
									onClick={() => setIsProfileOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={handleSignOut}
									className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
								>
									Sign out
								</button>
							</div>
						)}
					</div>
				) : (
					<Link href="/login" className="hover:underline font-bold text-blue-600">Log in</Link>
				)}
			</div>

			<button className="sm:hidden" onClick={toggleMenu}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<line x1="4" y1="12" x2="20" y2="12"></line>
					<line x1="4" y1="6" x2="20" y2="6"></line>
					<line x1="4" y1="18" x2="20" y2="18"></line>
				</svg>
			</button>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 sm:hidden">
					<div className="flex justify-end p-4">
						<button onClick={toggleMenu}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>

					<div className="flex flex-col items-center gap-6 p-8">
						<Link href="/" className="text-xl" onClick={toggleMenu}>Home</Link>

						{hasPortfolioAccess && (
							<Link
								href="/portfolio"
								className="text-xl px-6 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800 font-medium text-emerald-800 dark:text-emerald-300"
								onClick={toggleMenu}
							>
								<span>
									Portfolio
								</span>
							</Link>
						)}

						<Link href="/calendar" className="text-xl" onClick={toggleMenu}>Calendar</Link>
						<Link href="/newsletter" className="text-xl" onClick={toggleMenu}>Newsletter</Link>
						<Link href="/contact" className="text-xl" onClick={toggleMenu}>Contact</Link>
						<Link href="/about" className="text-xl" onClick={toggleMenu}>About</Link>

						{hasAdminAccess && (
							<Link href="/admin" className="text-xl font-bold text-blue-600" onClick={toggleMenu}>Admin</Link>
						)}

						{status === 'authenticated' ? (
							<>
								<Link href="/profile" className="text-xl font-semibold text-blue-600" onClick={toggleMenu}>Profile</Link>
								<button
									onClick={() => {
										handleSignOut();
										toggleMenu();
									}}
									className="text-xl text-red-500"
								>
									Sign out
								</button>
							</>
						) : (
							<Link href="/login" className="text-xl font-bold text-blue-600" onClick={toggleMenu}>Log in</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}