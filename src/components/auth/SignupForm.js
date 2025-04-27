'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate passwords match
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to register');
			}

			// Redirect to login page after successful registration
			router.push('/login?registered=true');
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 w-full max-w-md">
			<h2 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-geist-mono)]">
				Sign Up for Augustana SIF
			</h2>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="name">
						Name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
				>
					{isLoading ? 'Creating account...' : 'Sign Up'}
				</button>
			</form>

			<div className="mt-6 text-center">
				<p className="font-[family-name:var(--font-geist-mono)]">
					Already have an account?{' '}
					<Link href="/login" className="text-blue-500 hover:underline">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}