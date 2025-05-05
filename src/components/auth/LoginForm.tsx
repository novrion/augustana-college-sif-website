'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const handleSubmit = async (e) => {
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
		} catch (error) {
			setError("An unexpected error has occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-[family-name:var(--font-geist-mono)]">
			<Form
				onSubmit={handleSubmit}
				title={"Log In"}
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
						type={"submit"}
						text={"Log In"}
						loadingText={"Logging in..."}
						isLoading={isLoading}
						className={"w-full"}
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
			</Form>
		</div >
	);
}