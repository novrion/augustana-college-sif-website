'use client'

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@/components/Form"
import { FilledButton } from "@/components/Buttons";

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get('callbackUrl') || '/';


	useEffect(() => {
		// Check if there's an error in the URL (from Google auth)
		const errorMessage = searchParams?.get('error');
		if (errorMessage === 'AccessDenied') {
			setError('Only @augustana.edu Google accounts accepted');
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				router.push(callbackUrl);
				router.refresh();
			}
		} catch (_error) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-[family-name:var(--font-geist-mono)]">
			<Form
				onSubmit={handleSubmit}
				title="Log In"
				error={error}
			>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="flex justify-center">
					<FilledButton
						type="submit"
						text="Log In"
						loadingText="Logging in..."
						isLoading={isLoading}
						className="w-full"
					/>
				</div>

				<div className="mt-6 text-center">
					<p>
						Don&apos;t have an account?{' '}
						<Link href="/register" className="text-blue-500 hover:underline">
							Sign up
						</Link>
					</p>
				</div>

				<div className="flex items-center my-4">
					<div className="flex-grow border-t border-white/[.145]"></div>
					<span className="mx-4 text-sm text-gray-400">or</span>
					<div className="flex-grow border-t border-white/[.145]"></div>
				</div>

				<div className="mb-4 text-center">
					<p className="text-sm text-blue-400">
						<svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Google Sign In is restricted to @augustana.edu email addresses
					</p>
				</div>

				<button
					type="button"
					onClick={() => signIn('google', { callbackUrl: callbackUrl })}
					className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
				>
					<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
						<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
						<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
						<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
					</svg>
					Sign in with Google
				</button>
			</Form>
		</div>
	);
}