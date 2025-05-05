'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/Form"
import { FilledButton } from "@/components/Buttons";

export default function RegisterForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

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
			if (!response.ok) { throw new Error(data.error || 'Failed to register'); }

			router.push('/login?registered=true');
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-[family-name:var(--font-geist-mono)]">
			<Form
				onSubmit={handleSubmit}
				title={"Sign Up"}
				error={error}
			>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="name">
						Name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

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

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 font-[family-name:var(--font-geist-mono)]" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<FilledButton
						type={"submit"}
						text={"Sign Up"}
						loadingText={"Creating account..."}
						isLoading={isLoading}
						className={"w-full"}
					/>
				</div>

				<div className="mt-6 text-center">
					<p>
						Already have an account?{' '}
						<Link href="/login" className="text-blue-500 hover:underline">
							Log in
						</Link>
					</p>
				</div>
			</Form>
		</div >
	);
}