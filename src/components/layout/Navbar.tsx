'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { HoldingsLinkButton, LogInLinkButton, SignOutButton } from "@/components/Buttons";
import ProfilePicture from "@/components/ProfilePicture";
import { User } from '@/lib/types';

export default function Navbar() {
	const pathName = usePathname();
	const { session, isAuthenticated, hasHoldingsReadAccess, hasAdminDashboardAccess } = useAuth();
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	}

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<nav className="w-full px-8 py-4 sm:px-18 flex items-center justify-between border-b border-white/[.145] font-[family-name:var(--font-geist-mono)]">
			<Link href="/">
				<Image
					src="/logo.svg"
					alt="SIF"
					width={60}
					height={60}
				/>
			</Link>

			<div className="flex items-center gap-8">
				<HoldingsLinkButton
					text={"Portfolio"}
					href={"/holdings"}
					currentPathName={pathName}
					hasAccess={hasHoldingsReadAccess()}
				/>

				<Link href="/events" className="hover:underline">Events</Link>
				<Link href="/newsletter" className="hover:underline">Newsletter</Link>
				<Link href="/contact" className="hover:underline">Contact</Link>
				<Link href="/about" className="hover:underline">About</Link>

				{hasAdminDashboardAccess() && (
					<Link href="/admin" className="font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors">
						Admin
					</Link>
				)}

				{isAuthenticated ? (
					<div className="relative">
						<button
							onClick={toggleProfile}
							className="flex items-center gap-2"
						>
							<ProfilePicture
								user={session?.user as User}
								size={50}
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
		</nav >
	);
}