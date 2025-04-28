'use client';

import { useSession, signOut } from 'next-auth/react';


export default function Navbar() {
	const { data: session, status } = useSession();

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<footer className="mb-5 row-start-3 flex gap-6 flex-wrap items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="/contact"
			>
				Contact
			</a>

			{status === 'authenticated' ? (
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
						href="/signup"
					>
						Sign Up
					</a>

				</div>
			)}

			{status === 'authenticated' ? (
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
					Log In
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