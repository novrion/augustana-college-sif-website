'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AboutSectionForm({ initialData = null, maxOrderIndex = 0 }) {
	const { data: session } = useSession();
	const router = useRouter();
	const isEditing = !!initialData;

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		content: initialData?.content || '',
		order_index: initialData?.order_index || maxOrderIndex + 1
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		if (!formData.title || !formData.content) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		try {
			const url = isEditing
				? `/api/admin/about/update`
				: `/api/admin/about/add`;

			const body = isEditing
				? { ...formData, id: initialData.id }
				: formData;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error(`Server responded with non-JSON content: ${await response.text()}`);
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} about section`);
			}

			// Redirect back to about page
			router.push('/admin/about');
			router.refresh();
		} catch (error) {
			console.error("Submission error:", error);
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
			<h2 className="text-xl font-semibold mb-6">
				{isEditing ? 'Edit About Section' : 'Add New About Section'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="title">
						Title *
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="content">
						Content *
					</label>
					<textarea
						id="content"
						name="content"
						rows="12"
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-mono)]"
						required
					></textarea>
				</div>

				{isEditing && (
					<div className="text-sm text-gray-500">
						Order: {formData.order_index} (You can change order from the section list page)
					</div>
				)}

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/admin/about')}
						className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add About Section')}
					</button>
				</div>
			</form>
		</div>
	);
}