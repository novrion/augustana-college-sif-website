'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Form from "@/components/Form"
import { FilledButton } from "@/components/Buttons";

export default function RegisterForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Failed to register');
			}

			router.push('/login?registered=true');
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-[family-name:var(--font-geist-mono)]">
			<Form
				onSubmit={handleSubmit}
				title="Sign Up"
				error={error}
			>
				<div className="mb-6 text-center max-w-96">
					<p className="text-sm text-blue-400">
						<svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Augustana College associates should sign in directly with Google
					</p>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="name">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={formData.name}
						onChange={handleChange}
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
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
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
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						value={formData.confirmPassword}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<FilledButton
						type="submit"
						text="Sign Up"
						loadingText="Creating account..."
						isLoading={isLoading}
						className="w-full"
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
		</div>
	);
}