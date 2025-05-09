'use client';

import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {
	const { isAuthenticated } = useAuth();

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<footer className="mt-8 mb-5 row-start-3 flex gap-6 flex-wrap items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="/contact"
			>
				Contact
			</a>

			{isAuthenticated ? (
				<div className="flex justify-between">
					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4 font-bold text-blue-600"
						href="/profile"
					>
						Profile
					</a>


				</div>
			) : (
				<div className="flex justify-between">
					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4 font-semibold text-blue-600"
						href="/register"
					>
						Sign up
					</a>

				</div>
			)}

			{isAuthenticated ? (
				<a
					onClick={handleSignOut}
					className="flex items-center gap-2 hover:underline cursor-pointer hover:underline-offset-4 text-red-500"
				>
					Sign out
				</a>
			) : (
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4 font-semibold text-blue-600"
					href="/login"
				>
					Log in
				</a>
			)}

			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://www.augustana.edu/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Augustana College
			</a>
		</footer >
	);
}